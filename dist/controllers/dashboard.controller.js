"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const User_1 = require("../models/User");
const Blog_1 = require("../models/Blog");
const Product_1 = require("../models/Product");
const getOverview = async (req, res) => {
    try {
        // Get counts of different entities
        const userCount = await User_1.User.countDocuments();
        const blogCount = await Blog_1.Blog.countDocuments();
        const productCount = await Product_1.Product.countDocuments();
        // Additional metrics that would be useful for moderators
        const recentBlogs = await Blog_1.Blog.find().sort({ createdAt: -1 }).limit(5).select('title createdAt author');
        const recentProducts = await Product_1.Product.find().sort({ createdAt: -1 }).limit(5).select('productName createdAt');
        // For moderators, provide content-focused metrics
        const overviewData = {
            totalUsers: userCount,
            totalBlogs: blogCount,
            totalProducts: productCount,
            recentBlogs,
            recentProducts,
            userRole: req.user?.role,
            userName: req.user?.name,
            userEmail: req.user?.email,
        };
        res.status(200).json(overviewData);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching overview data", error });
    }
};
const getAdminStats = async (req, res) => {
    try {
        // Admin-specific stats
        const userCount = await User_1.User.countDocuments();
        const blogCount = await Blog_1.Blog.countDocuments();
        const productCount = await Product_1.Product.countDocuments();
        // Get user counts by role
        const adminCount = await User_1.User.countDocuments({ role: "admin" });
        const moderatorCount = await User_1.User.countDocuments({ role: "moderator" });
        const userCountByRole = await User_1.User.countDocuments({ role: "user" });
        const agentCount = await User_1.User.countDocuments({ role: "agent" });
        const adminStats = {
            totalUsers: userCount,
            totalBlogs: blogCount,
            totalProducts: productCount,
            roleDistribution: {
                admins: adminCount,
                moderators: moderatorCount,
                users: userCountByRole,
                agents: agentCount,
            },
            userRole: req.user?.role,
            userName: req.user?.name,
            userEmail: req.user?.email,
        };
        res.status(200).json(adminStats);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error });
    }
};
exports.dashboardController = {
    getOverview,
    getAdminStats,
};
