import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. User not found."
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User account is deactivated."
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired."
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

// Check if user is super admin
export const isSuperAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super admin privileges required."
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};