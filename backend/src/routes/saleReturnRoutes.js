import express from "express";
import {
  addSaleReturn,
  getAllSaleReturns,
  getSaleReturnById,
  deleteSaleReturn,
  updateSaleReturnStatus,
  updateSaleReturn,
} from "../controllers/saleReturnController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, adminOnly, addSaleReturn);
router.get("/all", protect, adminOnly, getAllSaleReturns);
router.get("/:id", protect, adminOnly, getSaleReturnById);
router.put("/status/:id", protect, adminOnly, updateSaleReturnStatus);
router.put("/update/:id", protect, adminOnly, updateSaleReturn);
router.delete("/delete/:id", protect, adminOnly, deleteSaleReturn);

export default router;