import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    ctnNo: {
      type: String,
      required: [true, "CTN No is required"],
      trim: true,
      uppercase: true,
    },
    productCode: {
      type: String,
      required: [true, "Product Code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageOriginalName: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
itemSchema.index({ ctnNo: 1 });
itemSchema.index({ category: 1 });

const Item = mongoose.model("Item", itemSchema);
export default Item;


