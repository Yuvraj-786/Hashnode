const mongoose = require("mongoose");
const postModel = require("../models/post.model");
const tagModel = require("../models/tag.model");
const AppError = require("../middleware/appError");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getExcerpt(content = "") {
  const plainText = String(content).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plainText.slice(0, 200);
}

function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(title, currentPostId = null) {
  const baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingPost = await postModel.findOne({
      slug,
      _id: { $ne: currentPostId },
    });

    if (!existingPost) break;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function resolveTags(tags = []) {
  if (!Array.isArray(tags)) {
    throw new AppError("Tags must be an array", 400);
  }

  const resolvedTagIds = [];

  for (const tag of tags) {
    if (typeof tag !== "string" || !tag.trim()) {
      throw new AppError("Each tag must be a non-empty string", 400);
    }

    if (mongoose.Types.ObjectId.isValid(tag)) {
      const existingTag = await tagModel.findById(tag);
      if (!existingTag) {
        throw new AppError(`Tag not found: ${tag}`, 400);
      }
      resolvedTagIds.push(existingTag._id.toString());
      continue;
    }

    const normalizedTag = String(tag).trim();
    const tagSlug = slugify(normalizedTag);
    if (!tagSlug || normalizedTag.length > 50) {
      throw new AppError("Tags must contain 1 to 50 valid characters", 400);
    }

    let existingTag = await tagModel.findOne({
      $or: [{ name: normalizedTag.toLowerCase() }, { slug: tagSlug }],
    });

    if (!existingTag) {
      existingTag = await tagModel.create({
        name: normalizedTag,
        slug: tagSlug,
      });
    }

    resolvedTagIds.push(existingTag._id.toString());
  }

  return [...new Set(resolvedTagIds)];
}

/**
 * @name getPostsController
 * @description /api/posts for public published feed with search + tag filtering
 * @access Public
 */
async function getPostsController(req, res, next) {
  try {
    const { search, tag } = req.query;
    const filter = { status: "published" };

    if (search) {
      if (typeof search !== "string" || search.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search must be a string of 100 characters or fewer",
        });
      }
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { content: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (tag) {
      if (typeof tag !== "string") {
        return res.status(400).json({ success: false, message: "Tag must be a string" });
      }
      const foundTag = await tagModel.findOne({
        $or: [{ name: tag.trim().toLowerCase() }, { slug: slugify(tag) }],
      });

      if (!foundTag) {
        return res.status(200).json({
          success: true,
          posts: [],
          count: 0,
        });
      }

      filter.tags = foundTag._id;
    }

    const posts = await postModel
      .find(filter)
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @name getMyPostsController
 * @description /api/posts/mine Get Current user posts (draft + published)
 * @access Private
 */
async function getMyPostsController(req, res, next) {
  try {
    const posts = await postModel
      .find({ author: req.user.id })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @name getPostBySlugController
 * @description /api/posts/:slug Get a single published post by slug
 * @access Public
 */
async function getPostBySlugController(req, res, next) {
  try {
    const post = await postModel
      .findOne({ slug: req.params.slug, status: "published" })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @name createPostController
 * @description /api/posts to create a new post
 * @access Private
 */
async function createPostController(req, res, next) {
  try {
    const { title, content, tags = [], coverImage = "", status = "draft" } = req.body || {};

    if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ success: false, message: "Title must be 200 characters or fewer" });
    }
    if (typeof coverImage !== "string" || !isHttpUrl(coverImage)) {
      return res.status(400).json({ success: false, message: "coverImage must be a valid http(s) URL" });
    }

    const allowedStatus = ["draft", "published"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either draft or published",
      });
    }

    const resolvedTags = await resolveTags(tags);
    const slug = await generateUniqueSlug(title);

    const newPost = await postModel.create({
      title: title.trim(),
      slug,
      content,
      excerpt: getExcerpt(content),
      coverImage,
      status,
      author: req.user.id,
      tags: resolvedTags,
    });

    const populatedPost = await postModel
      .findById(newPost._id)
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @name updatePostController
 * @description /api/posts/:id to update an owner-owned post
 * @access Private
 */
async function updatePostController(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const post = await postModel.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you are not authorized to update it",
      });
    }

    const { title, content, tags, coverImage, status } = req.body || {};

    if (typeof title !== "undefined") {
      if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string of 200 characters or fewer",
        });
      }
      post.title = title.trim();
    }

    if (typeof content !== "undefined") {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ success: false, message: "Content must be a non-empty string" });
      }
      post.content = content;
    }

    if (typeof coverImage !== "undefined") {
      if (typeof coverImage !== "string" || !isHttpUrl(coverImage)) {
        return res.status(400).json({
          success: false,
          message: "coverImage must be a valid http(s) URL",
        });
      }
      post.coverImage = coverImage;
    }

    if (typeof status !== "undefined") {
      const allowedStatus = ["draft", "published"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be either draft or published",
        });
      }
      post.status = status;
    }

    if (typeof tags !== "undefined") {
      post.tags = await resolveTags(tags);
    }

    if (typeof title !== "undefined" || typeof content !== "undefined") {
      post.slug = await generateUniqueSlug(post.title, post._id);
      post.excerpt = getExcerpt(post.content);
    }

    await post.save();

    const updatedPost = await postModel
      .findById(post._id)
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @name deletePostController
 * @description /api/posts/:id to delete an owner-owned post
 * @access Private
 */
async function deletePostController(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }

    const post = await postModel.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you are not authorized to delete it",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPostsController,
  getMyPostsController,
  getPostBySlugController,
  createPostController,
  updatePostController,
  deletePostController,
};