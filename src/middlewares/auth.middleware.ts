import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // Find user by ID from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if the user is an admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// Middleware to check if the user is an admin or moderator
export const requireAdminOrModerator = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return res.status(403).json({ message: "Admin or moderator access required" });
  }

  next();
};

// Middleware to check if the user is the owner of the resource
export const checkOwnership = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Check if the authenticated user is the same as the resource owner
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Access denied. You can only modify your own resources." });
  }

  next();
};

// Middleware to allow admins to access any resource, but require ownership for non-admins
export const requireAdminOrOwnership = (req: AuthRequest, res: Response, next: NextFunction) => {
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