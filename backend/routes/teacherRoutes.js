import express from "express";
// import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getStudentsByClassAndYear
} from "../controllers/teacherController.js";

const router = express.Router();

// router.use(protect);
// router.use(authorize("teacher"));
router.get("/students",getStudentsByClassAndYear)

export default router;