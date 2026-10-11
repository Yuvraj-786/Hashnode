const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/tokenBlacklist.model");

async function authUser(req, res, next) {
  const authorization = req.get("authorization");
  const bearerMatch = authorization && authorization.match(/^Bearer\s+(\S+)$/i);
  const token = bearerMatch && bearerMatch[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: authorization
        ? "Authorization header must use Bearer token format"
        : "Bearer token not provided",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    req.user = decoded;
    req.token = token;

    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: "Token revoked" });
    }

    return next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    return next(err);
  }
}

module.exports = { authUser };
