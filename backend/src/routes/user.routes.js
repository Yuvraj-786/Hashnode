const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { authUser } = require("../middleware/auth.middleware");

const userRouter = Router();

/**
 * @route GET /api/users/me
 * @description Get the authenticated user's profile
 * @access Private
 */
userRouter.get("/me", authUser, userController.getCurrentUserController);

/**
 * @route PUT /api/users/me
 * @description Update the logged-in user's own profile
 * @access Private
 */
userRouter.put("/me", authUser, userController.updateUserProfileController);

/**
 * @route GET /api/users/:id
 * @description Get a public profile and their published posts by id
 * @access Public
 */
userRouter.get("/:id", userController.getUserProfileController);

module.exports = userRouter;
