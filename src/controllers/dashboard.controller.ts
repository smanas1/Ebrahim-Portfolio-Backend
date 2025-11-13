import { Request, Response } from "express";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import { Product } from "../models/Product";

interface AuthRequest extends Request {
  user?: any;
}

const getOverview = async (req: AuthRequest, res: Response) => {
  try {
    // Get counts of different entities
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    const productCount = await Product.countDocuments();
    
    // Additional metrics that would be useful for moderators
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5).select('title createdAt author');
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).select('productName createdAt');
    
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching overview data", error });
  }
};

const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    // Admin-specific stats
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    const productCount = await Product.countDocuments();
    
    // Get user counts by role
    const adminCount = await User.countDocuments({ role: "admin" });
    const moderatorCount = await User.countDocuments({ role: "moderator" });
    const userCountByRole = await User.countDocuments({ role: "user" });
    const agentCount = await User.countDocuments({ role: "agent" });

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
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
};

export const dashboardController = {
  getOverview,
  getAdminStats,
};