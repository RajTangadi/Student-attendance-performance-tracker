import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";


// POST /api/attendance
// Body: { classId: "7B", date: "2025-11-04", records: [{ studentId, status }] }

export const markAttendanceForClass = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    console.log("classId:", classId, "date", date, "records: ", records);
    if (!classId || !date || !records) {
      return res.status(400).json({
        message: "classId, date, and records are required.",
      });
    }

    // Normalize the date (ignore time component)
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this class and date
    const existingAttendance = await Attendance.findOne({
      classId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance already submitted for this class and date.",
      });
    }

    // If no existing attendance, save new records
    const newRecords = records.map((record) => ({
      student: record.studentId,
      classId,
      date: attendanceDate,
      status: record.status,
    }));

    await Attendance.insertMany(newRecords);

    return res.status(201).json({
      message: "Attendance submitted successfully!",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAttendanceByStudent = async (req, res) => {
  try {
    const { id } = req.params;
    // if(!email){
    //   return res.status(400).json({message: "Email is required"});
    // }

    if(!id){
      return res.status(400).json({message: "Id is required"});
    }
    
    //Find the student by email
    // const student = await Student.find({email: email});
    const student = await Student.findById(id);
    if(!student){
      return res.status(404).json({message: "Student not found"});
    }
    const attendanceRecords = await Attendance.find({student: student._id});
    res.json({attendance: attendanceRecords});
  } catch (error) {
    console.log("Error fetching attendance by student email: ", error)
  }
}