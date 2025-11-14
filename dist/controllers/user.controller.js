"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length <= 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
        }
        bcryptjs_1.default.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error hashing password" });
            }
            const newUser = new User_1.User({ name, email, password: hash });
            await newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id, name, email }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            res.status(201).json({
                message: "User registered successfully",
                user: newUser,
                token,
            });
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.status(200).json({ message: "Login successful", user, token });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.User.find({}).select("-password"); // Exclude password field
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const updateUser = async (req, res) => {
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
        const updateData = { name, email };
        // Only add role to update if it's provided
        if (role !== undefined) { // Check if role is provided in the request
            updateData.role = role;
        }
        const updatedUser = await User_1.User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select("-password"); // Exclude password field
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User_1.User.findByIdAndDelete(req.params.id).select("-password");
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.userControllers = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
