import { Router } from "express";
import { blogController } from "../controllers/blog.controller";

const router = Router();

router.post("/create", blogController.createBlog);
router.get("/all-blogs", blogController.getBlogs);
export const blogRouter = router;
