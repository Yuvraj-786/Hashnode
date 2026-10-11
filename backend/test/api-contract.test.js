const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../src/models/user.model");
const postModel = require("../src/models/post.model");
const tokenBlacklistModel = require("../src/models/tokenBlacklist.model");
const { authUser } = require("../src/middleware/auth.middleware");
const authController = require("../src/controllers/auth.controller");
const app = require("../src/app");

require("../src/models/tag.model");

function routeList(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => {
      const method = Object.keys(layer.route.methods)[0].toUpperCase();
      return `${method} ${layer.route.path}`;
    });
}

test("user and post models use the API's name field and registered references", () => {
  assert.ok(userModel.schema.path("name"));
  assert.equal(userModel.schema.path("username"), undefined);
  assert.equal(postModel.schema.path("author").options.ref, "user");
  assert.equal(postModel.schema.path("tags").embeddedSchemaType.options.ref, "tag");
  assert.ok(mongoose.modelNames().includes("user"));
  assert.ok(mongoose.modelNames().includes("tag"));
  assert.ok(mongoose.modelNames().includes("post"));
});

test("auth routes match the documented methods and paths", () => {
  const routes = routeList(require("../src/routes/auth.routes"));

  assert.ok(routes.includes("POST /register"));
  assert.ok(routes.includes("POST /login"));
  assert.ok(routes.includes("GET /me"));
});

test("post, tag, and user routes expose the documented paths", () => {
  const postRoutes = routeList(require("../src/routes/post.routes"));
  const tagRoutes = routeList(require("../src/routes/tag.routes"));
  const userRoutes = routeList(require("../src/routes/user.routes"));

  assert.ok(postRoutes.includes("GET /"));
  assert.ok(postRoutes.includes("GET /mine"));
  assert.ok(postRoutes.includes("GET /:slug"));
  assert.ok(postRoutes.includes("POST /"));
  assert.ok(postRoutes.includes("PUT /:id"));
  assert.ok(postRoutes.includes("DELETE /:id"));
  assert.ok(tagRoutes.includes("GET /"));
  assert.ok(tagRoutes.includes("GET /:slug/posts"));
  assert.ok(userRoutes.includes("GET /:id"));
  assert.ok(userRoutes.includes("PUT /me"));
});

test("API returns JSON 404s and permits the configured frontend to send bearer headers", async (t) => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const preflight = await fetch(`${baseUrl}/api/posts`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:5173",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "authorization,content-type",
    },
  });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get("access-control-allow-headers"), /authorization/i);

  const missingRoute = await fetch(`${baseUrl}/api/missing`, {
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(missingRoute.status, 404);
  assert.equal(missingRoute.headers.get("content-type").split(";")[0], "application/json");
  assert.deepEqual(await missingRoute.json(), {
    success: false,
    message: "Route not found",
  });
});

test("protected routes require a valid bearer token", async () => {
  const oldSecret = process.env.JWT_SECRET;
  const originalFindOne = tokenBlacklistModel.findOne;
  process.env.JWT_SECRET = "test-only-secret";
  tokenBlacklistModel.findOne = async () => null;

  const invoke = async (authorization) => {
    const req = { get: () => authorization };
    let statusCode;
    let responseBody;
    let nextCalled = false;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    await authUser(req, res, () => {
      nextCalled = true;
    });
    return { req, statusCode, responseBody, nextCalled };
  };

  try {
    const token = jwt.sign({ id: "user-id" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const authorized = await invoke(`Bearer ${token}`);
    assert.equal(authorized.nextCalled, true);
    assert.equal(authorized.req.token, token);
    assert.equal(authorized.req.user.id, "user-id");

    const cookieOnly = await invoke(undefined);
    assert.equal(cookieOnly.statusCode, 401);
    assert.equal(cookieOnly.nextCalled, false);
    assert.match(cookieOnly.responseBody.message, /Bearer token/i);
  } finally {
    tokenBlacklistModel.findOne = originalFindOne;
    if (typeof oldSecret === "undefined") {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = oldSecret;
    }
  }
});

test("registration and login return a JWT and the name field", async () => {
  const oldSecret = process.env.JWT_SECRET;
  const originalFindOne = userModel.findOne;
  const originalCreate = userModel.create;
  process.env.JWT_SECRET = "test-only-secret";

  const userId = new mongoose.Types.ObjectId();
  const password = "password-123";
  const user = {
    _id: userId,
    name: "A Reader",
    email: "reader@example.com",
    password: await bcrypt.hash(password, 4),
  };
  const createResponse = () => {
    let statusCode;
    let body;
    return {
      res: {
        status(code) {
          statusCode = code;
          return this;
        },
        json(value) {
          body = value;
          return this;
        },
      },
      result: () => ({ statusCode, body }),
    };
  };

  try {
    userModel.findOne = async () => null;
    userModel.create = async () => user;
    const registration = createResponse();
    await authController.registerUserController(
      { body: { name: user.name, email: user.email, password } },
      registration.res,
    );
    const registered = registration.result();
    assert.equal(registered.statusCode, 201);
    assert.equal(registered.body.user.name, user.name);
    assert.equal(jwt.verify(registered.body.token, process.env.JWT_SECRET).id, userId.toString());

    userModel.findOne = () => ({ select: async () => user });
    const login = createResponse();
    await authController.loginUserController(
      { body: { email: user.email, password } },
      login.res,
    );
    const loggedIn = login.result();
    assert.equal(loggedIn.statusCode, 200);
    assert.equal(loggedIn.body.user.name, user.name);
    assert.equal(jwt.verify(loggedIn.body.token, process.env.JWT_SECRET).id, userId.toString());
  } finally {
    userModel.findOne = originalFindOne;
    userModel.create = originalCreate;
    if (typeof oldSecret === "undefined") {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = oldSecret;
    }
  }
});
