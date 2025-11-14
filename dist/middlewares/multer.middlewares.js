"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.getUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
// Storage for blog images
const blogStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
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
const productStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
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
const generalStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
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
const getUploadMiddleware = (type = 'general') => {
    let storage;
    switch (type) {
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
    return (0, multer_1.default)({ storage });
};
exports.getUploadMiddleware = getUploadMiddleware;
exports.upload = (0, multer_1.default)({ storage: generalStorage });
