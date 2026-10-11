const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const mongoose = require("mongoose");

/**
 * @name getCurrentUserController
 * @description Get current authenticated user's profile
 * @access Private
 */
async function getCurrentUserController(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
  } catch (error) {
    return next(error);
  }
}

/**
 * @name getUserProfileController
 * @description Get a public profile and their published posts by id
 * @access Public
 */
async function getUserProfileController(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await postModel
      .find({ author: user._id, status: "published" })
      .populate("author", "name avatarUrl")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
      posts,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @name updateUserProfileController
 * @description Update profile details for the authenticated user
 * @access Private
 */
async function updateUserProfileController(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, bio, avatarUrl } = req.body || {};
    const updates = {};

    if (typeof name !== "undefined") {
      if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
        return res.status(400).json({
          success: false,
          message: "Name must be a non-empty string of 80 characters or fewer",
        });
      }

      updates.name = name.trim();
    }

    if (typeof bio !== "undefined") {
      if (typeof bio !== "string" || bio.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Bio must be a string of 200 characters or fewer",
        });
      }
      updates.bio = bio;
    }

    if (typeof avatarUrl !== "undefined") {
      if (typeof avatarUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "avatarUrl must be a string",
        });
      }
      if (avatarUrl && !isHttpUrl(avatarUrl)) {
        return res.status(400).json({
          success: false,
          message: "avatarUrl must be a valid http(s) URL",
        });
      }

      updates.avatarUrl = avatarUrl || "";
    }

    const unknownFields = Object.keys(req.body || {}).filter(
      (field) => !["name", "bio", "avatarUrl"].includes(field),
    );
    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unsupported profile field: ${unknownFields[0]}`,
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    Object.assign(user, updates);
    await user.save();

    const updatedUser = await userModel.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    return next(error);
  }
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

module.exports = {
  getCurrentUserController,
  getUserProfileController,
  updateUserProfileController,
};
