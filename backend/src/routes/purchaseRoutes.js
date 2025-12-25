import express from "express";
import {
  addPurchase,
  getAllPurchases,
  updatePurchase,
  deletePurchase,
  getPurchaseById,
  getPurchaseVouchers,
} from "../controllers/purchaseController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Purchase APIs
router.post("/add", protect, adminOnly, addPurchase);
router.get("/all", protect, adminOnly, getAllPurchases);
router.put("/update/:id", protect, adminOnly, updatePurchase);
router.delete("/delete/:id", protect, adminOnly, deletePurchase);

// Purchase Voucher Routes
router.get("/vouchers", protect, adminOnly, getPurchaseVouchers); // Fetch data for new voucher
router.post("/voucher", protect, adminOnly, addPurchase);       // Save new voucher
router.get("/:id", protect, adminOnly, getPurchaseById);        // ✅ Get Single Purchase (Must be last)

export default router;
