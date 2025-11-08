import Student from "../models/Student.js";


//get Students by class and year
export const getStudentsByClassAndYear = async (req,res) => {
  try {
    
    const { class:className, year } = req.query;

  if (!className || !year) {
    return res.status(400).json({ message: "classId and year are required." });
  }

    const students = await Student.find({
      class: className,
      year: year
    });

  if (students.length === 0) {
    return res.status(404).json({ message: "No students found." });
  }

  res.json({ students: students });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message});
  }
}
