const { Router } = require("express");
const tagController = require("../controllers/tag.controller");
const { authUser } = require("../middleware/auth.middleware");

const tagRouter = Router();

/**
 * @route GET /api/tags
 * @description Get all tags with post counts
 * @access Public
 */
tagRouter.get("/", tagController.getTagsController);

/**
 * @route GET /api/tags/:slug/posts
 * @description List published posts under a specific tag
 * @access Public
 */
tagRouter.get("/:slug/posts", tagController.getTagPostsController);

/**
 * @route GET /api/tags/:slug
 * @description Get a tag by slug
 * @access Public
 */
tagRouter.get("/:slug", tagController.getTagBySlugController);

/**
 * @route POST /api/tags
 * @description Create a new tag
 * @access Private
 */
tagRouter.post("/", authUser, tagController.createTagController);

module.exports = tagRouter;
