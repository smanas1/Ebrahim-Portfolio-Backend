"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", user_controller_1.userControllers.registerUser);
router.post("/login", user_controller_1.userControllers.loginUser);
// Protected routes
router.get("/all-users", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, user_controller_1.userControllers.getAllUsers); // Admins and moderators can view all users
router.get("/:id", auth_middleware_1.verifyToken, user_controller_1.userControllers.getUserById); // User needs to be authenticated to view any profile
router.patch("/update/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrOwnership, user_controller_1.userControllers.updateUser); // Admins can update any user, others can only update themselves
router.delete("/delete/:id", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, user_controller_1.userControllers.deleteUser); // Only admins can delete any user
exports.userRoutes = router;
