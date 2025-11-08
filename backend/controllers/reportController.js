import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";
import path from "path";
import Student from "../models/Student.js";
import Performance from "../models/Performance.js";
import Attendance from "../models/Attendance.js";

// Initialize chart generator
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });

//Grade helper
const getGrade = (score) => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "F";
};

// Controller: Generate Class Report (Merged)
export const generateClassReport = async (req, res) => {
  try {
    const { classId, semester, year } = req.query;
    console.log(classId, semester, year);

    if (!classId || !semester || !year) {
      return res
        .status(400)
        .json({ message: "classId, semester, and year required" });
    }

    // Fetch students in the class
    const students = await Student.find({ class: classId });

    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No students found for this class." });
    }

    // Fetch performance + attendance
    const performances = await Performance.find({ classId, semester });
    const attendanceRecords = await Attendance.find({ classId });

    //  Merge data
    const reportData = students.map((student) => {
      const perf = performances.find(
        (p) => p.studentId.toString() === student._id.toString()
      );

      // Get attendance for this student
      const studentAttendance = attendanceRecords.filter(
        (a) => a.student.toString() === student._id.toString()
      );

      const totalDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(
        (a) => a.status === "Present"
      ).length;
      const attendancePercentage = totalDays
        ? ((presentDays / totalDays) * 100).toFixed(1)
        : 0;

      // const avgScore = perf ? perf.averageScore : 0;
      const avgScore = perf
        ? (perf.maths +
            perf.science +
            perf.social +
            perf.geography +
            perf.english +
            perf.it) /
          6
        : 0;

      const grade = getGrade(avgScore);

      return {
        rollNo: student.rollNo || "-",
        name: student.name,
        avgScore,
        grade,
        attendance: attendancePercentage,
      };
    });

    // 4️⃣ Compute summary metrics
    const totalStudents = reportData.length;
    const classAverage =
      reportData.reduce((sum, s) => sum + Number(s.avgScore), 0) /
        totalStudents || 0;
    const passCount = reportData.filter((s) => s.grade !== "F").length;
    const passPercentage = ((passCount / totalStudents) * 100).toFixed(2);

    // 5️⃣ Generate charts
    const barChart = await chartJSNodeCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: reportData.map((s) => s.name),
        datasets: [
          {
            label: "Average Score (%)",
            data: reportData.map((s) => s.avgScore),
            backgroundColor: "#4f46e5",
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    });

    const pieChart = await chartJSNodeCanvas.renderToBuffer({
      type: "pie",
      data: {
        labels: ["Pass", "Fail"],
        datasets: [
          {
            data: [passCount, totalStudents - passCount],
            backgroundColor: ["#22c55e", "#ef4444"],
          },
        ],
      },
    });

    // 6️⃣ Generate PDF
    const pdfDoc = new PDFDocument({ margin: 40 });
    const reportsDir = path.join("reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    const filePath = path.join(
      reportsDir,
      `ClassReport_${classId}_${Date.now()}.pdf`
    );
    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);

    // Header
    pdfDoc.fontSize(20).text("Class Performance Report", { align: "center" });
    pdfDoc.moveDown();
    pdfDoc.fontSize(12).text(`Class ID: ${classId}`);
    pdfDoc.text(`Academic Year: ${year}`);
    pdfDoc.text(`Semester: ${semester}`);
    pdfDoc.text(`Generated on: ${new Date().toLocaleDateString()}`);
    pdfDoc.moveDown(2);

    // Summary
    pdfDoc.fontSize(14).text("Summary", { underline: true });
    pdfDoc.moveDown(0.5);
    pdfDoc
      .fontSize(12)
      .text(`Total Students: ${totalStudents}`)
      .text(`Class Average: ${classAverage.toFixed(2)}%`)
      .text(`Pass Percentage: ${passPercentage}%`);
    pdfDoc.moveDown(2);

    // Charts
    pdfDoc.fontSize(14).text("Visual Insights", { underline: true });
    pdfDoc.moveDown(0.5);
    pdfDoc.image(barChart, { fit: [500, 250], align: "center" });
    pdfDoc.moveDown(1);
    pdfDoc.image(pieChart, { fit: [300, 200], align: "center" });
    pdfDoc.moveDown(2);

    // Table
    pdfDoc.fontSize(14).text("Student Performance", { underline: true });
    pdfDoc.moveDown(0.5);

    const tableTop = pdfDoc.y + 10;
    const columnPositions = [50, 120, 320, 400, 480];

    pdfDoc.fontSize(12).fillColor("black");
    pdfDoc.text("Roll No", columnPositions[0], tableTop);
    pdfDoc.text("Name", columnPositions[1], tableTop);
    pdfDoc.text("Avg Score", columnPositions[2], tableTop);
    pdfDoc.text("Grade", columnPositions[3], tableTop);
    pdfDoc.text("Attendance", columnPositions[4], tableTop);
    pdfDoc.moveDown();

    let y = tableTop + 20;
    reportData.forEach((s) => {
      pdfDoc.text(String(s.rollNo), columnPositions[0], y);
      pdfDoc.text(s.name, columnPositions[1], y);
      pdfDoc.text(
        `${(Number(s.avgScore) || 0).toFixed(2)}%`,
        columnPositions[2],
        y
      );

      pdfDoc.text(s.grade, columnPositions[3], y);
      pdfDoc.text(`${s.attendance}%`, columnPositions[4], y);
      y += 20;
    });

    pdfDoc.end();

    stream.on("finish", () => {
      res.download(filePath, (err) => {
        if (err) console.error("Error sending file:", err);
        fs.unlink(filePath, () => {}); // auto delete
      });
    });
  } catch (error) {
    console.error("Error generating class report:", error);
    res.status(500).json({ message: "Failed to generate class report" });
  }
};

