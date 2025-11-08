import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// CREATE TEACHER
export const createTeacher = async (req, res) => {
  try {
    const { name, email, subject } = req.body;
    console.log(name, email, subject);
    const existing = await Teacher.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Teacher already exists" });

    const teacher = await Teacher.create({ name, email, subject });

    res.status(201).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TEACHERS
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update Teacher
export const updateTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find teacher by ID
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update fields
    teacher.name = req.body.name || teacher.name;
    teacher.email = req.body.email || teacher.email;
    teacher.subject = req.body.subject || teacher.subject;

    const updatedTeacher = await teacher.save();

    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error while updating teacher" });
  }
};

// Delete Teacher by ID
export const deleteTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.deleteOne();

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Server error while deleting teacher" });
  }
};

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const { name, email, class: className, year } = req.body;
    console.log(name, email, className, year);

    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Student already exists" });

    const student = await Student.create({
      name,
      email,
      class: className,
      year,
    });

    res.status(201).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("class", "name");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find teacher by ID
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fields
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.class = req.body.class || student.class;
    student.year = req.body.year || student.year;

    const updatedStudent = await student.save();

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
