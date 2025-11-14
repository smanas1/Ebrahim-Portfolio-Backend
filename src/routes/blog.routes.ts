import { Router } from "express";
import { blogController } from "../controllers/blog.controller";
import { getUploadMiddleware } from "../middlewares/multer.middlewares";
import { verifyToken, requireAdmin, requireAdminOrModerator } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes - require authentication
router.post("/create", verifyToken, requireAdminOrModerator, getUploadMiddleware('blog').single("coverImage"), blogController.createBlog);
router.patch("/update/:id", verifyToken, requireAdminOrModerator, getUploadMiddleware('blog').single("coverImage"), blogController.updateBlog);
router.delete("/:id", verifyToken, requireAdminOrModerator, blogController.deleteBlog);

// Public routes
router.get("/all-blogs", blogController.getBlogs);
router.get("/:id", blogController.getBlog);

export const blogRouter = router;
