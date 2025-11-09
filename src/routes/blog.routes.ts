import { Router } from "express";
import { blogController } from "../controllers/blog.controller";
import { upload } from "../middlewares/multer.middlewares";

const router = Router();

router.post("/create", upload.single("coverImage"), blogController.createBlog);
router.patch("/update/:id", upload.single("coverImage"), blogController.updateBlog);
router.get("/all-blogs", blogController.getBlogs);
export const blogRouter = router;
