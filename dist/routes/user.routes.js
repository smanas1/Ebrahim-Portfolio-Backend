"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.userControllers.registerUser);
router.post("/login", user_controller_1.userControllers.loginUser);
exports.userRoutes = router;
