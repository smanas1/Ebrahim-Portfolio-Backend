import { Router } from "express";
import { userControllers } from "../controllers/user.controller";

const router = Router();

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);

export const userRoutes = router;
