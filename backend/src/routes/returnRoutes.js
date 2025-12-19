import express from "express";
import {
  addReturn,
  getAllReturns,
  updatePurchaseReturn,
  updateReturn
} from "../controllers/returncontroller.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, addReturn);
router.get("/all", protect, adminOnly, getAllReturns);
router.put("/status/:id", protect, adminOnly, updateReturn);
router.put("/update/:id", protect, adminOnly, updatePurchaseReturn);

export default router;
