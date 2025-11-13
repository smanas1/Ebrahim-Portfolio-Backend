import { Request, Response } from "express";
import { Blog } from "../models/Blog";

const createBlog = async (req: Request, res: Response) => {
  const { title, content, author, tags, category } = req.body;

  try {
    const coverImagePath = (req.file as any)?.path;
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
    // Handle image upload if included in the request
    const coverImage = req.file ? (req.file as any).path : undefined;
    
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
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
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
