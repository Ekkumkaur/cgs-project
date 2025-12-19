import express from "express";
import {
  addSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierSummary,
} from "../controllers/supplierController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
// 📊 Purchasers Detail Screen
router.get("/summary", protect, adminOnly, getSupplierSummary);

// Supplier CRUD
router.post("/add", protect, adminOnly, addSupplier);
router.get("/get/all", protect, adminOnly, getSuppliers);
router.get("/get/:id", protect, adminOnly, getSupplier);
router.put("/update/:id", protect, adminOnly, updateSupplier);
router.delete("/delete/:id", protect, adminOnly, deleteSupplier);



export default router;
