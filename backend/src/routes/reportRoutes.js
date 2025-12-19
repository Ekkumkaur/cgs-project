
import express from "express";
import { allReports } from "../controllers/reportController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ALL REPORTS ROUTE ================= */
router.get("/all", protect, adminOnly, allReports);

export default router;

