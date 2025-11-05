import express from "express";
import {
  getDomainInsight,
} from "../controllers/queryController.js";

const router = express.Router();

// POST /api/v1/query
router.post("/domainInsight", getDomainInsight);

export default router;
