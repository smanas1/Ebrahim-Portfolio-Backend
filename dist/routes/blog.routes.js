"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
router.post("/create", blog_controller_1.blogController.createBlog);
router.get("/all-blogs", blog_controller_1.blogController.getBlogs);
exports.blogRouter = router;
