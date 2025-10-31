import express from "express";
import {
    superAdminLogin,
    userLogin,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword
} from "../controllers/userController.js";
import { verifyToken, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/super-admin/login", superAdminLogin);
router.post("/login", userLogin);

// Protected routes - Super Admin Only
router.post("/create", verifyToken, isSuperAdmin, createUser);
router.get("/", verifyToken, isSuperAdmin, getAllUsers);
router.get("/:id", verifyToken, isSuperAdmin, getUserById);
router.put("/:id", verifyToken, isSuperAdmin, updateUser);
router.delete("/:id", verifyToken, isSuperAdmin, deleteUser);

// Protected routes - All authenticated users
router.put("/change-password", verifyToken, changePassword);

export default router;