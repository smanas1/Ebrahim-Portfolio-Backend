import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
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
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Blog = model<IBlog>("Blog", blogSchema);
