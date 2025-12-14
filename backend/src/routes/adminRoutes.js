import express from "express";
import { addAdmin, adminLogin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/add", addAdmin);
export default router;
