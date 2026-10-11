const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login an existing user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/me
 * @description Return the currently logged-in user's profile
 * @access Private
 */
authRouter.get("/me", authMiddleware.authUser, authController.getMeController);

/**
 * @route GET /api/auth/logout
 * @description Logout the logged-in user
 * @access Private
 */
authRouter.get("/logout", authMiddleware.authUser, authController.logoutUserController);

module.exports = authRouter;