import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/userModel.js";
import connectDB from "../configs/db.js";

const seedSuperAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: "super_admin" });

        if (existingSuperAdmin) {
            console.log("Super admin already exists!");
            console.log("Email:", existingSuperAdmin.email);
            console.log("Username:", existingSuperAdmin.username);
            process.exit(0);
        }

        // Create super admin
        const superAdmin = new User({
            username: process.env.SUPER_ADMIN_USERNAME || "superadmin",
            email: process.env.SUPER_ADMIN_EMAIL || "superadmin@penguin.com",
            password: process.env.SUPER_ADMIN_PASSWORD || "Penguin@123",
            fullName: process.env.SUPER_ADMIN_FULLNAME || "Super Administrator",
            role: "super_admin",
            isActive: true
        });

        await superAdmin.save();

        console.log("✅ Super admin created successfully!");
        console.log("==========================================");
        console.log("Email:", superAdmin.email);
        console.log("Password:", process.env.SUPER_ADMIN_PASSWORD || "Penguin@123");
        console.log("==========================================");
        console.log("Please login and change the password immediately!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding super admin:", error.message);
        process.exit(1);
    }
};

seedSuperAdmin();
