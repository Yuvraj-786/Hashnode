const mongoose = require("mongoose");

/**
 * @name userSchema
 * @description User model with attributes name, email, password, bio, and avatarUrl.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false     // prevents hash from leaking in query results
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
      validate: {
        validator: (v) => v === "" || /^https?:\/\//.test(v),
        message: "avatarUrl must be an valid http(s) URL",
      },
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
