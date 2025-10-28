import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "blogs", // folder name in Cloudinary
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

export const upload = multer({ storage });
