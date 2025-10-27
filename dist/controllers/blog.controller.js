"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const Blog_1 = require("../models/Blog");
const createBlog = async (req, res) => {
    const { title, content, author, coverImage, tags, category } = req.body;
    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .trim();
    };
    try {
        const newBlog = new Blog_1.Blog({
            title,
            slug: createSlug(title),
            content,
            author,
            coverImage,
            tags,
            category,
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating blog", error });
    }
};
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog_1.Blog.find();
        res.status(200).json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
};
exports.blogController = {
    createBlog,
    getBlogs,
};
