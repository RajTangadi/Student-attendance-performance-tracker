import express from "express";
import {
  getAttendanceByStudent,
  markAttendanceForClass,
} from "../controllers/attendanceController.js";

const router = express.Router();

// POST: Mark attendance for a specific class/date
router.post("/", markAttendanceForClass);

router.get("/:id", getAttendanceByStudent);

export default router;
