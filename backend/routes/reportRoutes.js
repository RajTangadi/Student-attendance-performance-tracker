import express from "express";
import { generateClassReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/class", generateClassReport);

export default router;


