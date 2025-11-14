"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: "Ebrahim Mohamad Kamal",
    },
    coverImage: {
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    category: {
        type: String,
    },
}, { timestamps: true });
exports.Blog = (0, mongoose_1.model)("Blog", blogSchema);
