import Category from "../models/categoryModel.js";

// Get all categories with optional search
export const getCategories = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { isActive: true };
    
    // Search by category code or name
    if (search) {
      query.$or = [
        { categoryCode: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } }
      ];
    }

    const categories = await Category.find(query)
      .populate('createdBy', 'fullName username email')
      .populate('updatedBy', 'fullName username email')
      .sort({ sequence: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('createdBy', 'fullName username email')
      .populate('updatedBy', 'fullName username email');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message
    });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { categoryCode, categoryName, deptCode, deptName, sequence } = req.body;
    const userId = req.user._id;

    // Validation
    if (!categoryCode || !categoryName || !deptCode || !deptName || sequence === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: categoryCode, categoryName, deptCode, deptName, sequence"
      });
    }

    // Check if category code already exists
    const existingCategory = await Category.findOne({ categoryCode: categoryCode.toUpperCase() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category code already exists"
      });
    }

    // Create category
    const category = await Category.create({
      categoryCode: categoryCode.toUpperCase(),
      categoryName,
      deptCode,
      deptName,
      sequence: Number(sequence),
      createdBy: userId
    });

    const populatedCategory = await Category.findById(category._id)
      .populate('createdBy', 'fullName username email');

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: populatedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category code already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryCode, categoryName, deptCode, deptName, sequence } = req.body;
    const userId = req.user._id;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Check if category code is being changed and if new code already exists
    if (categoryCode && categoryCode.toUpperCase() !== category.categoryCode) {
      const existingCategory = await Category.findOne({ 
        categoryCode: categoryCode.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category code already exists"
        });
      }
    }

    // Update fields
    if (categoryCode) category.categoryCode = categoryCode.toUpperCase();
    if (categoryName) category.categoryName = categoryName;
    if (deptCode) category.deptCode = deptCode;
    if (deptName) category.deptName = deptName;
    if (sequence !== undefined) category.sequence = Number(sequence);
    category.updatedBy = userId;
    category.updatedAt = new Date();

    await category.save();

    const updatedCategory = await Category.findById(id)
      .populate('createdBy', 'fullName username email')
      .populate('updatedBy', 'fullName username email');

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category code already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
};

// Delete category (soft delete)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Soft delete
    category.isActive = false;
    category.updatedBy = userId;
    category.updatedAt = new Date();
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
};

