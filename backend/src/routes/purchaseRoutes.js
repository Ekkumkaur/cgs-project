import express from "express";
import {
  addPurchase,
  getAllPurchases,
  updatePurchase,
  deletePurchase,
  getPurchaseVouchers,
  getPurchaseVoucherByNo,
} from "../controllers/purchaseController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Purchase APIs
router.post("/add", protect, adminOnly, addPurchase);
router.get("/all", protect, adminOnly, getAllPurchases);
router.put("/update/:id", protect, adminOnly, updatePurchase);
router.delete("/delete/:id", protect, adminOnly, deletePurchase);
// purchase voucher list
router.get("/voucher",protect, adminOnly, getPurchaseVouchers);
router.get("/voucher/:voucherNo", protect, adminOnly, getPurchaseVoucherByNo);


export default router;
