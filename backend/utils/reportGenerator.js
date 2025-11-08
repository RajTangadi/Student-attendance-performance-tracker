import jsPDF from "jspdf";
import "jspdf-autotable";

const formatPercent = (n) =>
  typeof n === "number" ? `${(Math.round(n * 100) / 100).toFixed(2)}%` : n;


function drawStatCard(doc, x, y, width, height, title, value, color) {
  doc.setDrawColor(230);
  doc.rect(x, y, width, height, "S");
  doc.setFontSize(10);
  doc.setTextColor("#666");
  doc.text(title, x + 8, y + 12);
  doc.setFontSize(20);
  doc.setTextColor(color || "#000");
  doc.text(String(value), x + 8, y + 32);
}


export function getGradeLetter(percent) {
  if (percent === "N/A" || percent === null || isNaN(percent)) return "N/A";
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  if (percent > 0) return "F";
  return "N/A";
}


export const generateClassReport = (classInfo, mergedStudents, year) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Class Performance Report", pageWidth / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    `${classInfo.name} - Academic Year ${year}`,
    pageWidth / 2,
    85,
    { align: "center" }
  );
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    100,
    { align: "center" }
  );

  // Summary stats
  const totalStudents = mergedStudents.length;
  const numericScores = mergedStudents
    .map((s) => (typeof s.avgScore === "number" ? s.avgScore : null))
    .filter((v) => v !== null && !isNaN(v));
  const classAvg =
    numericScores.length > 0
      ? numericScores.reduce((a, b) => a + b, 0) / numericScores.length
      : "N/A";

  const passCount = mergedStudents.filter((s) => {
    if (typeof s.avgScore === "number") return s.avgScore >= 33;
    if (s.grade) return s.grade !== "F" && s.grade !== "N/A";
    return false;
  }).length;
  const passPct =
    totalStudents > 0 ? (passCount / totalStudents) * 100 : "N/A";

  const cardY = 120;
  const cardW = (pageWidth - 80) / 3;
  drawStatCard(
    doc,
    40,
    cardY,
    cardW,
    60,
    "Total Students",
    String(totalStudents),
    "#2B6CB0"
  );
  drawStatCard(
    doc,
    40 + cardW + 10,
    cardY,
    cardW,
    60,
    "Class Average",
    typeof classAvg === "number" ? `${classAvg.toFixed(2)}%` : "N/A",
    "#16A34A"
  );
  drawStatCard(
    doc,
    40 + (cardW + 10) * 2,
    cardY,
    cardW,
    60,
    "Pass Percentage",
    typeof passPct === "number" ? `${passPct.toFixed(1)}%` : "N/A",
    "#8B5CF6"
  );

  // Table header & rows
  const tableY = cardY + 90;
  const tableBody = mergedStudents.map((s, idx) => [
    idx + 1,
    s.name,
    typeof s.avgScore === "number" ? `${s.avgScore.toFixed(2)}%` : s.avgScore || "-",
    s.grade || getGradeLetter(s.avgScore || "N/A"),
    typeof s.attendancePct === "number" ? `${s.attendancePct.toFixed(1)}%` : s.attendancePct || "N/A",
  ]);

  doc.autoTable({
    startY: tableY,
    head: [["Roll No", "Name", "Avg Score", "Grade", "Attendance"]],
    body: tableBody,
    styles: { font: "helvetica", fontSize: 11 },
    headStyles: { fillColor: [245, 246, 250], textColor: [30, 30, 30] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 200 },
      2: { cellWidth: 80, halign: "center" },
      3: { cellWidth: 60, halign: "center" },
      4: { cellWidth: 80, halign: "center" },
    },
  });

  doc.setFontSize(10);
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : tableY + 20;
  doc.text(
    `Class Average (calculated) : ${typeof classAvg === "number" ? classAvg.toFixed(2) + "%" : "N/A"}`,
    40,
    finalY
  );
  doc.text(
    `Pass Percentage : ${typeof passPct === "number" ? passPct.toFixed(1) + "%" : "N/A"}`,
    40,
    finalY + 14
  );

  doc.save(`${classInfo.name.replace(/\s+/g, "_")}_ClassReport_${year}.pdf`);
};


export const generateStudentReport = (student, classInfo, year) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Student Performance Report", pageWidth / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`${classInfo.name} - ${year}`, pageWidth / 2, 80, { align: "center" });
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 96, {
    align: "center",
  });

  // Top summary cards
  const cardY = 120;
  const cardW = (pageWidth - 100) / 2;
  drawStatCard(
    doc,
    40,
    cardY,
    cardW,
    70,
    "Overall Average",
    typeof student.avgScore === "number" ? `${student.avgScore.toFixed(2)}%` : student.avgScore || "N/A",
    "#2563EB"
  );

  drawStatCard(
    doc,
    40 + cardW + 20,
    cardY,
    cardW,
    70,
    "Grade",
    student.grade || getGradeLetter(student.avgScore || "N/A"),
    "#16A34A"
  );

  const cardY2 = cardY + 90;
  drawStatCard(
    doc,
    40,
    cardY2,
    cardW,
    70,
    "Attendance",
    student.totalDays && student.presentDays
      ? `${((student.presentDays / student.totalDays) * 100).toFixed(1)}% \n${student.presentDays}/${student.totalDays} days`
      : student.attendancePct !== undefined
      ? `${typeof student.attendancePct === "number" ? student.attendancePct.toFixed(1) + "%" : student.attendancePct}`
      : "N/A",
    "#8B5CF6"
  );

  drawStatCard(
    doc,
    40 + cardW + 20,
    cardY2,
    cardW,
    70,
    "Remarks",
    student.remarks || (student.avgScore >= 80 ? "Excellent Performance" : "Needs Improvement"),
    "#000"
  );

  // Subject-wise table
  const subjects = student.subjects || {};
  const tableY = cardY2 + 100;
  const tableBody = Object.keys(subjects).map((sub) => {
    const marks = subjects[sub];
    const markVal = typeof marks === "number" ? `${marks}/100` : marks || "-";
    const grade = typeof marks === "number" ? getGradeLetter(marks) : "-";
    return [sub.charAt(0).toUpperCase() + sub.slice(1), markVal, grade];
  });

  doc.setFontSize(14);
  doc.text("Subject-wise Performance", 40, tableY - 10);

  doc.autoTable({
    startY: tableY,
    head: [["Subject", "Marks", "Grade"]],
    body: tableBody,
    headStyles: { fillColor: [245, 246, 250] },
    styles: { fontSize: 11 },
    columnStyles: { 0: { cellWidth: 200 } },
  });

  doc.save(`${student.name.replace(/\s+/g, "_")}_Report_${year}.pdf`);
};
