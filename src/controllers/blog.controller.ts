import { Request, Response } from "express";
import { Blog } from "../models/Blog";

const createBlog = async (req: Request, res: Response) => {
  const { title, content, author, coverImage, tags, category } = req.body;

  try {
    const coverImage = (req.file as any)?.path;
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
      coverImage,
      tags,
      category,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
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
  getBlogs,
};
