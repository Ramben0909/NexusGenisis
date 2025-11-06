import express from "express";
import { getFutureInsights } from "../controllers/insightController.js";

const router = express.Router();

// POST /api/v1/insight
router.post("/future", getFutureInsights);

export default router;
