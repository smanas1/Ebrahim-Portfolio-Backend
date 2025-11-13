import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }
      const newUser = new User({ name, email, password: hash });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, name, email },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30d",
        }
      );
      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, role } = req.body;

    // Check if trying to update another user's role
    if (role && req.user && req.params.id !== req.user._id.toString()) {
      // Only admin can update another user's role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Only admin users can update other users' roles" });
      }
    }

    // Only allow role updates for admin users (when updating any user)
    if (role && req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admin users can update user roles" });
    }

    const updateData: any = { name, email };

    // Only add role to update if it's provided
    if (role !== undefined) { // Check if role is provided in the request
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password field

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userControllers = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
