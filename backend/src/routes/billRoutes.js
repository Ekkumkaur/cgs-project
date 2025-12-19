import express from "express";
import {
  addBill,
  getBills,
  getBillById,
  getBillsByCustomer,
  getBillsByDateRange,
  updateBill,
  deleteBill,
  generateBillByCustomer,
} from "../controllers/billController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/add", protect, adminOnly, addBill);
router.get("/all", protect, adminOnly, getBills);
router.get("/date-range", protect, adminOnly, getBillsByDateRange);
router.get("/details/:id", protect, adminOnly, getBillById);
router.get("/customer/:customerId", protect, adminOnly, getBillsByCustomer);
router.put("/update/:id", protect, adminOnly, updateBill);
router.delete("/delete/:id", protect, adminOnly, deleteBill);
router.get(
  "/generate/customer/:customerId",
  protect,
  adminOnly,
  generateBillByCustomer
);


export default router;
