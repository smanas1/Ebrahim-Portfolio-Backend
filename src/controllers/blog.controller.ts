import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import cloudinary from "../configs/cloudinary";

const createBlog = async (req: Request, res: Response) => {
  const { title, content, author, tags, category } = req.body;

  try {
    const coverImagePath = req.file ? (req.file.path || req.file.secure_url) : undefined;
    const createSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim();
    };
    const newBlog = new Blog({
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
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author, tags, category } = req.body;
  try {
    // Find the existing blog to check if we need to delete the old image
    const existingBlog = await Blog.findById(id);

    // Handle image upload if included in the request
    const coverImage = req.file ? (req.file.path || req.file.secure_url) : undefined;

    const updateData: any = {
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

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    // If a new image was uploaded and there was an old image, delete the old one from Cloudinary
    if (coverImage && existingBlog?.coverImage) {
      try {
        // Extract public ID from the old Cloudinary URL
        const urlParts = existingBlog.coverImage.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExt.split('.')[0]; // Remove file extension

        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteErr) {
        console.error('Error deleting old image from Cloudinary:', deleteErr);
        // Continue with the update even if image deletion fails
      }
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find the blog to get image URL before deletion
    const blog = await Blog.findById(id);
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
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteErr) {
        console.error('Error deleting image from Cloudinary:', deleteErr);
        // Continue with blog deletion even if image deletion fails
      }
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog and associated image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

const getBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

export const blogController = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getBlogs,
};
