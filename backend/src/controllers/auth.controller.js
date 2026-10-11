const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/tokenBlacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

/**
 * @name registerUserController
 * @description Register a new user, expects name, email and password in request body
 * @access Public
 */
async function registerUserController(req, res) {
  const { name, email, password } = req.body || {};

  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and password",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const normalizedName = name.trim();
  if (normalizedName.length > 80) {
    return res.status(400).json({
      success: false,
      message: "Name must be 80 characters or fewer",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const isUserAlreadyExists = await userModel.findOne({ email: normalizedEmail });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      success: false,
      message: "An account already exists with this email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hash,
  });

  const token = createToken(user._id);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

/**
 * @name loginUserController
 * @description logins an existing user with email and password
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await userModel.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = createToken(user._id);

  return res.status(200).json({
    success: true,
    message: "User logged In successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

/**
 * @name logoutUserController
 * @description Revoke the authenticated bearer token.
 * @access Private
 */
async function logoutUserController(req, res) {
  await tokenBlacklistModel.create({
    token: req.token,
    expiresAt: new Date(req.user.exp * 1000),
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}

/**
 *
 * @name getMeController
 * @description to access the user details to check if it is logged in or logged out.
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
