"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrOwnership = exports.checkOwnership = exports.requireAdminOrModerator = exports.requireAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ message: "Access token is required" });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user by ID from token
        const user = await User_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyToken = verifyToken;
// Middleware to check if the user is an admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
// Middleware to check if the user is an admin or moderator
const requireAdminOrModerator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({ message: "Admin or moderator access required" });
    }
    next();
};
exports.requireAdminOrModerator = requireAdminOrModerator;
// Middleware to check if the user is the owner of the resource
const checkOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    // Check if the authenticated user is the same as the resource owner
    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Access denied. You can only modify your own resources." });
    }
    next();
};
exports.checkOwnership = checkOwnership;
// Middleware to allow admins to access any resource, but require ownership for non-admins
const requireAdminOrOwnership = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    // Allow if user is admin
    if (req.user.role === 'admin') {
        return next();
    }
    // Otherwise, check if the user owns the resource
    if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Access denied. You can only modify your own resources." });
    }
    next();
};
exports.requireAdminOrOwnership = requireAdminOrOwnership;
