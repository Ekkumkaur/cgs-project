import express from "express";
import {
  addBill,
  getBills,
  getBillById,
  getBillsByCustomer,
  getBillsByDateRange,
  updateBill,
  deleteBill,
  updateBillPaymentStatus,
  getDraftBills,
} from "../controllers/billController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import { generateBillByCustomer } from "../controllers/billGenerator.js";



const router = express.Router();

// Static routes first to avoid conflicts with dynamic routes
router.get("/all", protect, adminOnly, getBills);
router.get("/date-range", protect, adminOnly, getBillsByDateRange);
router.get("/drafts", protect, adminOnly, getDraftBills);

// Then dynamic/other routes
router.post("/add", protect, adminOnly, addBill);
router.get("/details/:id", protect, adminOnly, getBillById);
router.get("/customer/:customerId", protect, adminOnly, getBillsByCustomer);
router.put("/update/:id", protect, adminOnly, updateBill);
router.put("/status/:id", protect, adminOnly, updateBillPaymentStatus);
router.delete("/delete/:id", protect, adminOnly, deleteBill);
router.get(
  "/generate/customer/:customerId",
  protect,
  adminOnly,
  generateBillByCustomer
);
export default router;
