import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All category routes require authentication
router.get("/", verifyToken, getCategories);
router.get("/:id", verifyToken, getCategoryById);
router.post("/", verifyToken, createCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;

