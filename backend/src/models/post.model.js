const mongoose = require("mongoose")

/**
 * @name postSchema
 * @description Post model with attributes title, slug, content, excerpt, coverImage, status, author, tags.
 */

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true, 
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxlength: 250
    },
    coverImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'], 
        default: 'draft'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tags: 
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tag'
        }]
}, { timestamps: true });

const postModel = mongoose.model("post", postSchema)

module.exports = postModel;