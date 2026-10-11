const tagModel = require("../models/tag.model");
const postModel = require("../models/post.model");

function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getTagsController(req, res, next) {
  try {
    const tags = await tagModel.find().sort({ name: 1 });
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await postModel.countDocuments({
          tags: tag._id,
          status: "published",
        });

        return {
          ...tag.toObject(),
          postCount,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      tags: tagsWithCounts,
      count: tagsWithCounts.length,
    });
  } catch (error) {
    return next(error);
  }
}

async function getTagBySlugController(req, res, next) {
  try {
    const tag = await tagModel.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      success: true,
      tag,
    });
  } catch (error) {
    return next(error);
  }
}

async function getTagPostsController(req, res, next) {
  try {
    const tag = await tagModel.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    const posts = await postModel
      .find({ tags: tag._id, status: "published" })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tag,
      posts,
      count: posts.length,
    });
  } catch (error) {
    return next(error);
  }
}

async function createTagController(req, res, next) {
  try {
    const { name } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const normalizedName = String(name).trim();
    const tagSlug = slugify(normalizedName);
    if (!tagSlug || normalizedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Tag name must contain 1 to 50 valid characters",
      });
    }

    const existingTag = await tagModel.findOne({
      $or: [{ name: normalizedName.toLowerCase() }, { slug: tagSlug }],
    });

    if (existingTag) {
      return res.status(200).json({
        success: true,
        message: "Tag already exists",
        tag: existingTag,
      });
    }

    const newTag = await tagModel.create({
      name: normalizedName,
      slug: tagSlug,
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      tag: newTag,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getTagsController,
  getTagBySlugController,
  getTagPostsController,
  createTagController,
};
