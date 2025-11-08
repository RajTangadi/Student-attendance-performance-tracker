import express from "express";
import { getYearlyAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/yearly", getYearlyAnalytics);

export default router;
