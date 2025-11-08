import express from "express";
import { fetchPerformanceByClassAndSem, fetchPerformanceByStudent, fetchPerformanceSummaryByStudent, savePerformance } from "../controllers/performanceController.js";

const router = express.Router();

// Save Student Performance
router.post("/save", savePerformance);

// Fetch Performance by Class + Semester
router.get("/class", fetchPerformanceByClassAndSem);

router.get("/student/:studentId", fetchPerformanceByStudent);

router.get("/student/:studentId/summary", fetchPerformanceSummaryByStudent);


export default router;
