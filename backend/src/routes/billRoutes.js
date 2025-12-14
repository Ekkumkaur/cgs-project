import express from "express";
import {
  addBill,
  getAllBills,
  getBillById,
  updatePaymentStatus,
  returnBill,
  deleteBill,
  getBillsByDateRange,
} from "../controllers/billcontroller.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, addBill);

router.get("/all", protect, adminOnly, getAllBills);

router.get("/filter-by-date", protect, adminOnly, getBillsByDateRange);

router.get("/:id", protect, adminOnly, getBillById);

router.put("/status/:id", protect, adminOnly, updatePaymentStatus);

router.put("/return/:id", protect, adminOnly, returnBill);

router.delete("/delete/:id", protect, adminOnly, deleteBill);


export default router;
