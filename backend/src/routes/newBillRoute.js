import express from "express";
import {
  addNewBill,
  getAllNewBills,
  getNewBillById,
} from "../controllers/newBillController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected and admin-only
router.post("/add", protect, adminOnly, addNewBill);
router.get("/all", protect, adminOnly, getAllNewBills);
router.get("/:id", protect, adminOnly, getNewBillById);

export default router;
