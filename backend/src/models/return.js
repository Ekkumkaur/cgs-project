import mongoose from "mongoose";
import Supplier from "./supplier.js";

const purchaseReturnSchema = new mongoose.Schema(
  {
    returnId: {
      type: String,
      required: true,
      unique: true,
    },
    purchase: {  // ✅ Changed from purchaseId to purchase
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    supplierName: { type: String, default: "" },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      enum: ["DAMAGED", "EXPIRED", "OTHER"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "REJECTED"],
      default: "PENDING",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

purchaseReturnSchema.pre("save", async function (next) {
  if ((this.isNew || this.isModified("supplier")) && this.supplier && mongoose.Types.ObjectId.isValid(this.supplier)) {
    try {
      const supplierDoc = await Supplier.findById(this.supplier);
      if (supplierDoc) {
        this.supplierName = supplierDoc.name;
      }
    } catch (error) {
      console.error("Error fetching supplier name for return:", error);
    }
  }
  next();
});

export default mongoose.model("PurchaseReturn", purchaseReturnSchema);