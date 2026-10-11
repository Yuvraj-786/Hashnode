const { Router } = require("express");
const postController = require("../controllers/post.controller");
const { authUser } = require("../middleware/auth.middleware");

const postRouter = Router();

/**
 * @route GET /api/posts
 * @description Get all published posts for the public feed
 * @access Public
 */
postRouter.get("/", postController.getPostsController);

/**
 * @route GET /api/posts/mine
 * @description Get all posts for the logged-in user, including drafts
 * @access Private
 */
postRouter.get("/mine", authUser, postController.getMyPostsController);

/**
 * @route GET /api/posts/:slug
 * @description Get a single published post by slug
 * @access Public
 */
postRouter.get("/:slug", postController.getPostBySlugController);

/**
 * @route POST /api/posts
 * @description Create a new post, either draft or published
 * @access Private
 */
postRouter.post("/", authUser, postController.createPostController);

/**
 * @route PUT /api/posts/:id
 * @description Update an existing post owned by the logged-in user
 * @access Private (owner)
 */
postRouter.put("/:id", authUser, postController.updatePostController);

/**
 * @route DELETE /api/posts/:id
 * @description Delete a post owned by the logged-in user
 * @access Private (owner)
 */
postRouter.delete("/:id", authUser, postController.deletePostController);

module.exports = postRouter;
