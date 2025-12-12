// routes/billRoutes.js
import express from "express";
import { addBill, deleteBill, getBillById, getBills, updateBill, updatePaymentStatus } from "../controllers/billController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addBill);            // CREATE
router.get("/all", protect, getBills);            // READ ALL
router.get("/:id", protect, getBillById);         // READ ONE
router.put("/update/:id", protect, updateBill);   // UPDATE
router.delete("/delete/:id", protect, deleteBill);// DELETE
router.put("/status/:id", protect, updatePaymentStatus); // PAYMENT STATUS UPDATE

export default router;
