import express from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", verifyToken, getItems);
router.get("/:id", verifyToken, getItemById);
router.post("/", verifyToken, upload.single("image"), createItem);
router.put("/:id", verifyToken, upload.single("image"), updateItem);
router.delete("/:id", verifyToken, deleteItem);

export default router;


