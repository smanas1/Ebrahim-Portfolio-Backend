"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const Blog_1 = require("../models/Blog");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const createBlog = async (req, res) => {
    const { title, content, author, tags, category } = req.body;
    try {
        const coverImagePath = req.file ? (req.file.path || req.file.secure_url) : undefined;
        const createSlug = (title) => {
            return title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w\-]+/g, "")
                .replace(/\-\-+/g, "-")
                .trim();
        };
        const newBlog = new Blog_1.Blog({
            title,
            slug: createSlug(title),
            content,
            author,
            coverImage: coverImagePath,
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
const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, author, tags, category } = req.body;
    try {
        // Find the existing blog to check if we need to delete the old image
        const existingBlog = await Blog_1.Blog.findById(id);
        // Handle image upload if included in the request
        const coverImage = req.file ? (req.file.path || req.file.secure_url) : undefined;
        const updateData = {
            title,
            content,
            author,
            tags,
            category,
        };
        // Only include coverImage in the update if a new image was uploaded
        if (coverImage) {
            updateData.coverImage = coverImage;
        }
        const blog = await Blog_1.Blog.findByIdAndUpdate(id, updateData, { new: true } // Return the updated document
        );
        // If a new image was uploaded and there was an old image, delete the old one from Cloudinary
        if (coverImage && existingBlog?.coverImage) {
            try {
                // Extract public ID from the old Cloudinary URL
                const urlParts = existingBlog.coverImage.split('/');
                const publicIdWithExt = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExt.split('.')[0]; // Remove file extension
                // Delete old image from Cloudinary
                await cloudinary_1.default.uploader.destroy(publicId);
            }
            catch (deleteErr) {
                console.error('Error deleting old image from Cloudinary:', deleteErr);
                // Continue with the update even if image deletion fails
            }
        }
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating blog", error });
    }
};
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the blog to get image URL before deletion
        const blog = await Blog_1.Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // Delete image from Cloudinary if it exists
        if (blog.coverImage) {
            try {
                // Extract public ID from the Cloudinary URL
                // Assuming Cloudinary URLs follow the format: https://res.cloudinary.com/.../upload/.../public_id.ext
                const urlParts = blog.coverImage.split('/');
                const publicIdWithExt = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExt.split('.')[0]; // Remove file extension
                // Delete image from Cloudinary
                await cloudinary_1.default.uploader.destroy(publicId);
            }
            catch (deleteErr) {
                console.error('Error deleting image from Cloudinary:', deleteErr);
                // Continue with blog deletion even if image deletion fails
            }
        }
        await Blog_1.Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog and associated image deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};
const getBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog_1.Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
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
    updateBlog,
    deleteBlog,
    getBlog,
    getBlogs,
};
