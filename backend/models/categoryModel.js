import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryCode: {
    type: String,
    required: [true, "Category Code is required"],
    unique: true, // unique: true automatically creates an index
    trim: true,
    uppercase: true
  },
  categoryName: {
    type: String,
    required: [true, "Category Name is required"],
    trim: true
  },
  deptCode: {
    type: String,
    required: [true, "Department Code is required"],
    trim: true
  },
  deptName: {
    type: String,
    required: [true, "Department Name is required"],
    trim: true
  },
  sequence: {
    type: Number,
    required: [true, "Sequence Number is required"],
    min: [0, "Sequence must be a positive number"]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Additional indexes for faster searches (categoryCode already indexed by unique: true)
categorySchema.index({ categoryName: 1 });
categorySchema.index({ deptCode: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;

