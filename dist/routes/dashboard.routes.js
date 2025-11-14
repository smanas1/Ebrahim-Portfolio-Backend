"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Overview route that both admin and moderator can access
router.get("/overview", auth_middleware_1.verifyToken, auth_middleware_1.requireAdminOrModerator, dashboard_controller_1.dashboardController.getOverview);
// Admin only stats
router.get("/admin-stats", auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, dashboard_controller_1.dashboardController.getAdminStats);
exports.dashboardRouter = router;
