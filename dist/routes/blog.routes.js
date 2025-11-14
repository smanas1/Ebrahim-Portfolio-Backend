"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.post("/create", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, (0, multer_middlewares_1.getUploadMiddleware)('blog').single("coverImage"), blog_controller_1.blogController.createBlog);
router.patch("/update/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, (0, multer_middlewares_1.getUploadMiddleware)('blog').single("coverImage"), blog_controller_1.blogController.updateBlog);
router.delete("/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, blog_controller_1.blogController.deleteBlog);
// Public routes
router.get("/all-blogs", blog_controller_1.blogController.getBlogs);
router.get("/:id", blog_controller_1.blogController.getBlog);
exports.blogRouter = router;
