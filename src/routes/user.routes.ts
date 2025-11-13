import { Router } from "express";
import { userControllers } from "../controllers/user.controller";
import { verifyToken, requireAdmin, requireAdminOrOwnership, requireAdminOrModerator } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);

// Protected routes
router.get("/all-users", verifyToken, requireAdminOrModerator, userControllers.getAllUsers); // Admins and moderators can view all users
router.get("/:id", verifyToken, userControllers.getUserById); // User needs to be authenticated to view any profile
router.patch("/update/:id", verifyToken, requireAdminOrOwnership, userControllers.updateUser); // Admins can update any user, others can only update themselves
router.delete("/delete/:id", verifyToken, requireAdmin, userControllers.deleteUser); // Only admins can delete any user

export const userRoutes = router;
