import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { verifyToken, requireAdmin, requireAdminOrModerator } from "../middlewares/auth.middleware";

const router = Router();

// Overview route that both admin and moderator can access
router.get("/overview", verifyToken, requireAdminOrModerator, dashboardController.getOverview);

// Admin only stats
router.get("/admin-stats", verifyToken, requireAdmin, dashboardController.getAdminStats);

export const dashboardRouter = router;