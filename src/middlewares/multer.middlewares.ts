import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary";

// Storage for blog images
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "blogs", // folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Limit size to reduce bandwidth
        { quality: "auto:good" } // Optimize quality
      ]
    };
  },
});

// Storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "products", // folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [
        { width: 1200, height: 800, crop: "limit" }, // Limit size to reduce bandwidth
        { quality: "auto:good" } // Optimize quality
      ]
    };
  },
});

// Storage for general images
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "general", // default folder in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [
        { width: 800, height: 600, crop: "limit" }, // Limit size to reduce bandwidth
        { quality: "auto:good" } // Optimize quality
      ]
    };
  },
});

// Function to create multer instance based on upload type
export const getUploadMiddleware = (type: 'blog' | 'product' | 'general' = 'general') => {
  let storage;
  switch(type) {
    case 'blog':
      storage = blogStorage;
      break;
    case 'product':
      storage = productStorage;
      break;
    case 'general':
    default:
      storage = generalStorage;
      break;
  }
  return multer({ storage });
};

export const upload = multer({ storage: generalStorage });
