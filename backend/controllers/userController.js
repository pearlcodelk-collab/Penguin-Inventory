import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    });
};

// Super Admin Login
export const superAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check if super admin
        if (user.role !== "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super admin credentials required."
            });
        }

        // Check if active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// User Login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check if active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Create User (Super Admin Only)
export const createUser = async (req, res) => {
    try {
        const { username, email, password, fullName, role } = req.body;

        // Validation
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email or username already exists."
            });
        }

        // Validate role - prevent creating super admin
        const userRole = role || "user";
        if (!["super_admin", "user"].includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'super_admin' or 'user'."
            });
        }

        // Prevent creating super admin accounts
        if (userRole === "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot create super admin accounts. Only one super admin is allowed."
            });
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: userRole,
            createdBy: req.user._id
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Get All Users (Super Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Get Single User (Super Admin Only)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("createdBy", "username email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Update User (Super Admin Only)
export const updateUser = async (req, res) => {
    try {
        const { username, email, fullName, role, isActive } = req.body;
        const userId = req.params.id;

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if trying to update another super admin (only super admin can be updated by themselves)
        if (user.role === "super_admin" && user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Cannot modify another super admin account."
            });
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (fullName) user.fullName = fullName;
        
        // Prevent changing role to or from super_admin
        if (role && ["super_admin", "user"].includes(role)) {
            if (user.role === "super_admin" || role === "super_admin") {
                return res.status(403).json({
                    success: false,
                    message: "Cannot change super admin role."
                });
            }
            user.role = role;
        }
        
        // Prevent changing super admin active status
        if (typeof isActive === "boolean") {
            if (user.role === "super_admin") {
                return res.status(403).json({
                    success: false,
                    message: "Cannot change super admin status."
                });
            }
            user.isActive = isActive;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Delete User (Super Admin Only) - Soft delete
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Prevent deleting super admin
        if (user.role === "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete super admin account."
            });
        }

        // Soft delete - deactivate user
        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User deactivated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long."
            });
        }

        // Find user with password
        const user = await User.findById(req.user._id);

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};