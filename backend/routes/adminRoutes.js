import express from "express";
import {
  createTeacher,
  getTeachers,
  createStudent,
  getStudents,
  updateTeacherById,
  deleteTeacherById,
  updateStudentById,
  deleteStudentById,
} from "../controllers/adminController.js";

const router = express.Router();

// Auth
// router.post("/login", adminLogin);

// Teachers
router.post("/teachers", createTeacher);
router.get("/teachers", getTeachers);
router.put("/teachers/:id", updateTeacherById);
router.delete("/teachers/:id", deleteTeacherById);

// Students
router.post("/students", createStudent);
router.get("/students", getStudents);
router.put("/students/:id", updateStudentById);
router.delete("/students/:id", deleteStudentById)


export default router;
