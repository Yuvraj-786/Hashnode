const mongoose = require("mongoose");

/**
 * @name tagSchema
 * @description Tag model with attributes name and slug.
 */

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: true, 
        unique: true
    }
}, { timestamps: true });

const tagModel = mongoose.model("tag", tagSchema)

module.exports = tagModel;