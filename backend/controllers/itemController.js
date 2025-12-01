import Item from "../models/itemModel.js";
import Category from "../models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";

// Get all items with optional search
export const getItems = async (req, res) => {
  try {
    const { search } = req.query;

    const query = { isActive: true };
    if (search) {
      query.$or = [
        { ctnNo: { $regex: search, $options: "i" } },
        { productCode: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(query)
      .populate("category", "categoryCode categoryName")
      .populate("createdBy", "fullName username email")
      .populate("updatedBy", "fullName username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

// Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id)
      .populate("category", "categoryCode categoryName")
      .populate("createdBy", "fullName username email")
      .populate("updatedBy", "fullName username email");

    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message,
    });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const { ctnNo, productCode, categoryId } = req.body;
    const userId = req.user._id;

    if (!ctnNo || !productCode || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Required fields: ctnNo, productCode, categoryId",
      });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Unique productCode
    const existing = await Item.findOne({
      productCode: productCode.toUpperCase(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product Code already exists",
      });
    }

    const payload = {
      ctnNo: String(ctnNo).toUpperCase(),
      productCode: String(productCode).toUpperCase(),
      category: category._id,
      createdBy: userId,
    };

    if (req.body.imageUrl && typeof req.body.imageUrl === "string") {
      payload.imageUrl = req.body.imageUrl;
      payload.imageOriginalName = req.file?.originalname || "";
    } else if (req.file && req.file.buffer) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "items",
              resource_type: "image",
              use_filename: true,
              unique_filename: true,
              overwrite: false,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        payload.imageUrl = uploadResult.secure_url || uploadResult.url || "";
        payload.imageOriginalName = req.file.originalname || "";
      } catch (e) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: e.message,
        });
      }
    }

    const item = await Item.create(payload);
    const populated = await Item.findById(item._id)
      .populate("category", "categoryCode categoryName")
      .populate("createdBy", "fullName username email");

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      item: populated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product Code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { ctnNo, productCode, categoryId } = req.body;
    const userId = req.user._id;

    const item = await Item.findById(id);
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // If changing productCode, ensure unique
    if (productCode) {
      const newCode = productCode.toUpperCase();
      if (newCode !== item.productCode) {
        const exists = await Item.findOne({
          productCode: newCode,
          _id: { $ne: id },
        });
        if (exists) {
          return res.status(400).json({
            success: false,
            message: "Product Code already exists",
          });
        }
        item.productCode = newCode;
      }
    }

    if (ctnNo) {
      item.ctnNo = String(ctnNo).toUpperCase();
    }
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
      item.category = category._id;
    }

    if (req.body.imageUrl && typeof req.body.imageUrl === "string") {
      item.imageUrl = req.body.imageUrl;
      item.imageOriginalName = req.file?.originalname || "";
    } else if (req.file && req.file.buffer) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "items",
              resource_type: "image",
              use_filename: true,
              unique_filename: true,
              overwrite: false,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        item.imageUrl = uploadResult.secure_url || uploadResult.url || "";
        item.imageOriginalName = req.file.originalname || "";
      } catch (e) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: e.message,
        });
      }
    }

    item.updatedBy = userId;
    item.updatedAt = new Date();
    await item.save();

    const updated = await Item.findById(id)
      .populate("category", "categoryCode categoryName")
      .populate("createdBy", "fullName username email")
      .populate("updatedBy", "fullName username email");

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product Code already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// Soft delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const item = await Item.findById(id);
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.isActive = false;
    item.updatedBy = userId;
    item.updatedAt = new Date();
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};


