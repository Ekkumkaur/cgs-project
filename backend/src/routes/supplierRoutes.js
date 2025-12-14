import express from "express";
import {
  addSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ROUTES
router.post("/add", protect, adminOnly, addSupplier);
router.get("/", protect, adminOnly, getSuppliers);
router.get("/:id", protect, adminOnly, getSupplier);
router.put("/update/:id", protect, adminOnly, updateSupplier);
router.delete("/delete/:id", protect, adminOnly, deleteSupplier);

export default router;
