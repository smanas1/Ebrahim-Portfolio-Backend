import { Router } from "express";
import { userControllers } from "../controllers/user.controller";

const router = Router();

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/all-users", userControllers.getAllUsers);
router.get("/:id", userControllers.getUserById);
router.patch("/update/:id", userControllers.updateUser);
router.delete("/delete/:id", userControllers.deleteUser);

export const userRoutes = router;
