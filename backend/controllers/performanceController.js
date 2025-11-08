import Performance from "../models/Performance.js";

//Save Student Performance
// /api/performance/save
export const savePerformance = async (req, res) => {
  try {
    const { classId, semester, performances } = req.body;

    if (!classId || !semester || !performances) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if semester records already exist for this class
    const existingRecords = await Performance.findOne({ classId, semester });
    if (existingRecords) {
      return res
        .status(409)
        .json({ message: `Records for ${semester} already registered.` });
    }

    // Save each student's record
    const records = await Promise.all(
      performances.map(async (record) => {
        const existing = await Performance.findOne({
          studentId: record.studentId,
          classId,
          semester,
        });

        if (existing) {
          // Update existing performance
          return await Performance.findByIdAndUpdate(
            existing._id,
            { $set: record },
            { new: true }
          );
        } else {
          // Create new performance record
          return await Performance.create({
            classId,
            semester,
            ...record,
          });
        }
      })
    );

    res.status(201).json({
      message: "Student performances saved successfully!",
      data: records,
    });
  } catch (error) {
    console.error("Error saving performance:", error);
    res.status(500).json({ message: "Server error while saving performance." });
  }
};

// Fetch Performance by Class + Semester
// /api/performance/class
export const fetchPerformanceByClassAndSem = async (req, res) => {
  try {
    const { classId, semester } = req.query;
    if (!classId || !semester) {
      return res.status(400).json({ message: "classId and semester required" });
    }

    const records = await Performance.find({ classId, semester });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ message: "Failed to fetch performance records." });
  }
};


// Fetch Performance by Student ID
// /api/performance/student/:studentId
export const fetchPerformanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    // Build query
    const query = { studentId };
    if (semester) {
      query.semester = semester;
    }

    // Fetch performance records
    const performanceRecords = await Performance.find(query)
      .sort({ semester: 1 }) // Sort by semester
      .select('-__v'); // Exclude version key

    if (!performanceRecords || performanceRecords.length === 0) {
      return res.status(404).json({ 
        message: semester 
          ? `No performance records found for student in ${semester}`
          : "No performance records found for this student"
      });
    }

    res.status(200).json({
      studentId,
      records: performanceRecords
    });
  } catch (error) {
    console.error("Error fetching student performance:", error);
    res.status(500).json({ message: "Failed to fetch student performance records." });
  }
};


// Fetch Performance Summary by Student ID (All semesters)
// /api/performance/student/:studentId/summary
export const fetchPerformanceSummaryByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Fetch all performance records for the student
    const performanceRecords = await Performance.find({ studentId })
      .sort({ semester: 1 })
      .select('-__v');

    if (!performanceRecords || performanceRecords.length === 0) {
    return res.status(404).json({ 
        message: "No performance records found for this student"
      });
    }

    // Calculate summary statistics
    const summary = {
      studentId,
      totalSemesters: performanceRecords.length,
      semesters: performanceRecords.map(record => ({
        semester: record.semester,
        classId: record.classId,
        totalMarks: record.total,
        grade: record.grade,
        average: Math.round(record.total / 6),
        subjects: {
          maths: record.maths,
          science: record.science,
            social: record.social,
          geography: record.geography,
          english: record.english,
          it: record.it
        }
      })),
      overallAverage: Math.round(
        performanceRecords.reduce((acc, record) => acc + (record.total / 6), 0) / performanceRecords.length
      ),
      bestSemester: performanceRecords.reduce((best, current) => 
        current.total > best.total ? current : best
      ),
      gradeTrend: performanceRecords.map(record => ({
        semester: record.semester,
        grade: record.grade,
        total: record.total
      }))
 };
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching student performance summary:", error);
    res.status(500).json({ message: "Failed to fetch student performance summary." });
  }
};
