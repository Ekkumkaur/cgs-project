import express from "express";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/get", protect, adminOnly, getDashboardData);

export default router;
