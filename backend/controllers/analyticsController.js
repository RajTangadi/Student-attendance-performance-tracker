import Attendance from "../models/Attendance.js";
import Performance from "../models/Performance.js";
import mongoose from "mongoose";

export const getYearlyAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    // Attendance Analytics
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedAttendance = [
      {
        name: "Present",
        value:
          attendanceStats.find((a) => a._id === "Present")?.count || 0,
      },
      {
        name: "Absent",
        value:
          attendanceStats.find((a) => a._id === "Absent")?.count || 0,
      },
    ];

    // Performance Analytics
    const performanceData = await Performance.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: "$subject",
          avgMarks: { $avg: "$marks" },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          avgMarks: 1,
        },
      },
    ]);

    res.json({
      year: currentYear,
      attendanceStats: formattedAttendance,
      performanceData,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};