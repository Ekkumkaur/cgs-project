// routes/ledgerRoutes.js
import express from "express";
import {
  addLedgerEntry,
  getCustomerLedger,
  getSupplierLedger
} from "../controllers/ledgerController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/ledger/add
 * Add single ledger entry (sale/purchase/payment/receipt)
 */
router.post("/add", protect, adminOnly, addLedgerEntry);

/**
 * GET /api/ledger/supplier
 * Query params: search, filterType, fromDate, toDate, page, limit
 */
router.get("/supplier", protect, adminOnly, getSupplierLedger);

/**
 * GET /api/ledger/customer
 * Query params: search, filterType, fromDate, toDate, page, limit
 */
router.get("/customer", protect, adminOnly, getCustomerLedger);

export default router;
