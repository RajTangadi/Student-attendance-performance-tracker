import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Alert,
  Nav,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  Mortarboard,       // 🎓 Graduation cap
  Book,              // 📘 Book icon
  ClipboardData,     // 📋 For attendance
  Award,             // 🏅 Grades
  BarChartFill,      // 📊 Reports
  BoxArrowRight,     // 🚪 Logout
} from "react-bootstrap-icons";


import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getStudentsByClassAndYear,
  markAttendanceForClass,
} from "../api/teacherApi";
import {
  getPerformanceByClass,
  saveStudentPerformance,
} from "../api/performanceService";
import { generateClassReport, generateStudentReport } from "../api/reportApi";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [semesterReport, setSemesterReport] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [grades, setGrades] = useState({});
  const [message, setMessage] = useState("");
  const [reportType, setReportType] = useState("class");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [tempMarks, setTempMarks] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSemLocked, setIsSemLocked] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

  useEffect(() => {
    setClasses([
      { id: "10A", name: "Class 10A" },
      { id: "10B", name: "Class 10B" },
      { id: "9A", name: "Class 9A" },
      { id: "9B", name: "Class 9B" },
      { id: "8A", name: "Class 8A" },
      { id: "8B", name: "Class 8B" },
      { id: "7A", name: "Class 7A" },
      { id: "7B", name: "Class 7B" },
    ]);
  }, []);

  const openMarkPopup = (student) => {
    setSelectedStudent(student);
    setTempMarks(grades[student._id] || {});
    setShowPopup(true);
  };

  const handleSaveMarks = () => {
    if (!selectedStudent) return;

    for (const [subject, value] of Object.entries(tempMarks)) {
      if (value === "" || value === undefined) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Marks",
          text: `Please enter marks for ${subject.toUpperCase()}.`,
        });
        return;
      }

      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: `${subject.toUpperCase()} marks must be a valid number.`,
        });
        return;
      }

      if (numericValue < 0 || numericValue > 100) {
        Swal.fire({
          icon: "error",
          title: "Invalid Marks Range",
          text: `${subject.toUpperCase()} marks must be between 0 and 100.`,
        });
        return;
      }
    }

    setGrades((prev) => ({
      ...prev,
      [selectedStudent._id]: tempMarks,
    }));

    setShowPopup(false);
    setMessage(`✅ Marks saved for ${selectedStudent.name}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmitPerformance = async () => {
    if (!selectedClass || !selectedSemester) {
      setMessage("⚠️ Please select a class and semester first!");
      return;
    }

    if (Object.keys(grades).length === 0) {
      setMessage("⚠️ No student marks entered yet!");
      return;
    }

    setIsSubmitting(true);

    try {
      const checkResponse = await getPerformanceByClass(
        selectedClass,
        selectedSemester
      );
      if (checkResponse.ok && checkResponse.data.length > 0) {
        Swal.fire({
          icon: "warning",
          title: `❗Records for ${selectedSemester} already exist. You cannot submit again.`,
        });

        setIsSemLocked(true);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        classId: selectedClass,
        semester: selectedSemester,
        performances: Object.entries(grades).map(([studentId, subjects]) => ({
          studentId,
          ...subjects,
        })),
      };

      const response = await saveStudentPerformance(payload);

      if (response.ok) {
        setMessage("✅ Student performance saved successfully!");
        setGrades({});
        setIsSemLocked(true);
      } else {
        setMessage("❌ Failed to save performance. Try again!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error while saving performance!");
    }

    setIsSubmitting(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClassSelect = async (classId) => {
    if (!selectedYear) {
      setMessage("⚠️ Please select a year before selecting a class!");
      return;
    }
    setSelectedClass(classId);
    setMessage("");
    setStudents([]);

    try {
      const response = await getStudentsByClassAndYear(classId, selectedYear);
      let studentsData = response.data.students;

      if (!response.ok) {
        console.log("Failed to fetch students.");
      }

      if (!Array.isArray(studentsData) || studentsData.length === 0) {
        setMessage("⚠️ No students found for this class.");
        return;
      }

      setStudents(studentsData);
      setAttendance({});
      setGrades({});
      setMessage(
        `✅ Loaded ${studentsData.length} students for ${classId} (${selectedYear})`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleMarkAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      setMessage("⚠️ Please mark attendance for at least one student!");
      return;
    }

    try {
      const attendanceData = {
        classId: selectedClass,
        date: selectedDate,
        year: selectedYear,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      };

      const response = await markAttendanceForClass(attendanceData);

      if (response.ok) {
        setMessage("✅ Attendance marked successfully!");
        setAttendance({});
      }
      if (!response.success) {
        if (response.status === 409) {
          Swal.fire({
            icon: "warning",
            title: "Already Submitted",
            text: response.message,
          });
        }
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Attendance submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting attendance:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong while submitting attendance.",
      });
    }
  };

  const handleGenerateReport = async () => {
    if (!semesterReport) return alert("Select semester!");

    let response;
    if (reportType === "class") {
      response = await generateClassReport(
        selectedClass,
        semesterReport,
        selectedYear
      );
    } else {
      response = await generateStudentReport(selectedStudent, semesterReport);
    }

    if (response.ok) {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        reportType === "class"
          ? `Class_${selectedClass}_Report_Sem${semesterReport}.pdf`
          : `Student_${selectedStudent}_Report_Sem${semesterReport}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert("Failed to generate report");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">📚 View Assigned Classes</h2>
                <p className="text-muted">Select a class to manage students and academic activities</p>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Select Academic Year</Form.Label>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setSelectedClass("");
                      setStudents([]);
                      setMessage("");
                    }}
                  >
                    <option value="">-- Select Year --</option>
                    {years.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row className="g-3">
                  {classes.map((cls) => (
                    <Col key={cls.id} md={6} lg={4}>
                      <Card 
                        className={`h-100 cursor-pointer transition-all ${
                          selectedClass === cls.id
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border"
                        }`}
                        onClick={() => handleClassSelect(cls.id)}
                      >
                        <Card.Body className="text-center">
                          <Book size={32} className="text-primary mb-3" />
                          <h5 className="fw-bold">{cls.name}</h5>
                          <p className="text-muted mb-3">
                            Students:{" "}
                            {students.length > 0 && selectedClass === cls.id
                              ? students.length
                              : "N/A"}
                          </p>
                          <Badge
                            bg={selectedClass === cls.id ? "primary" : "secondary"}
                          >
                            {selectedClass === cls.id ? "Selected" : "Select Class"}
                          </Badge>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </>
        );

      case "attendance":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">📝 Mark Daily Attendance</h2>
                <p className="text-muted">Record student attendance for the selected date</p>
              </Col>
            </Row>

            {!selectedClass ? (
              <Alert variant="info">
                Please select a class from the "View Classes" section first.
              </Alert>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <strong>Selected Class:</strong>{" "}
                      {classes.find((c) => c.id === selectedClass)?.name}
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="table-responsive">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>#</th>
                          <th>Student ID</th>
                          <th>Student Name</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>
                              <Badge bg="secondary">{student._id}</Badge>
                            </td>
                            <td className="fw-semibold">{student.name}</td>
                            <td>
                              <div className="d-flex justify-content-center gap-3">
                                {["Present", "Absent"].map((status) => (
                                  <Form.Check
                                    key={status}
                                    type="radio"
                                    name={`attendance-${student._id}`}
                                    label={status}
                                    checked={attendance[student._id] === status}
                                    onChange={(e) =>
                                      handleAttendanceChange(
                                        student._id,
                                        e.target.checked ? status : ""
                                      )
                                    }
                                    className="fw-semibold"
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div className="text-end mt-4">
                    <Button
                      onClick={handleMarkAttendance}
                      variant="primary"
                      size="lg"
                    >
                      Submit Attendance
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        );

      case "grades":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">🎓 Add Student Performance</h2>
                <p className="text-muted">Enter marks and grades for students</p>
              </Col>
            </Row>

            {!selectedClass ? (
              <Alert variant="info">
                Please select a class from the "View Classes" section first.
              </Alert>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <strong>Selected Class:</strong>{" "}
                      {classes.find((c) => c.id === selectedClass)?.name}
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Semester</Form.Label>
                        <Form.Select
                          value={selectedSemester}
                          onChange={(e) => {
                            const newSem = e.target.value;
                            setSelectedSemester(newSem);
                            setGrades({});
                            setIsSemLocked(false);
                            setMessage("");
                          }}
                        >
                          <option value="">Select Semester</option>
                          <option value="Sem1">Semester 1</option>
                          <option value="Sem2">Semester 2</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="table-responsive">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Maths</th>
                          <th>Science</th>
                          <th>Social</th>
                          <th>Geography</th>
                          <th>English</th>
                          <th>IT</th>
                          <th>Grade</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => {
                          const studentGrades = grades[student._id] || {};
                          const total = [
                            "maths", "science", "social", "geography", "english", "it"
                          ].reduce(
                            (acc, subj) =>
                              acc + (parseInt(studentGrades[subj]) || 0),
                            0
                          );
                          const avg = total / 6 || 0;
                          let grade = "";
                          if (avg >= 90) grade = "A+";
                          else if (avg >= 80) grade = "A";
                          else if (avg >= 70) grade = "B";
                          else if (avg >= 60) grade = "C";
                          else if (avg >= 35) grade = "D";
                          else if (avg > 0) grade = "F";

                          return (
                            <tr key={student._id}>
                              <td>{index + 1}</td>
                              <td className="fw-semibold">{student.name}</td>
                              {["maths", "science", "social", "geography", "english", "it"].map((subject) => (
                                <td key={subject} className="text-center">
                                  {studentGrades[subject] || "-"}
                                </td>
                              ))}
                              <td className="text-center">
                                <Badge bg={avg >= 60 ? "success" : "danger"}>
                                  {grade || "-"}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => openMarkPopup(student)}
                                >
                                  Add Marks
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

                  <div className="text-end mt-4">
                    <Button
                      onClick={handleSubmitPerformance}
                      disabled={isSubmitting || isSemLocked}
                      variant={isSemLocked ? "secondary" : "success"}
                      size="lg"
                    >
                      {isSemLocked
                        ? "🔒 Semester Locked"
                        : isSubmitting
                        ? "Saving..."
                        : "💾 Submit Performance"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Marks Input Modal */}
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  Add Marks for {selectedStudent?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {["maths", "science", "social", "geography", "english", "it"].map((subject) => (
                  <Form.Group key={subject} className="mb-3">
                    <Form.Label className="fw-semibold text-capitalize">
                      {subject.replace("-", " ")}
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      placeholder={`Enter ${subject} marks`}
                      value={tempMarks[subject] || ""}
                      onChange={(e) =>
                        setTempMarks({
                          ...tempMarks,
                          [subject]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPopup(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveMarks}>
                  Save Marks
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );

      case "reports":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">📊 Generate Reports</h2>
                <p className="text-muted">Create and download academic reports</p>
              </Col>
            </Row>

            {!selectedClass ? (
              <Alert variant="info">
                Please select a class from the "View Classes" section first.
              </Alert>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <strong>Selected Class:</strong>{" "}
                      {classes.find((c) => c.id === selectedClass)?.name}
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Semester</Form.Label>
                        <Form.Select
                          value={semesterReport}
                          onChange={(e) => setSemesterReport(e.target.value)}
                        >
                          <option value="">Select Semester</option>
                          <option value="Sem1">Semester 1</option>
                          <option value="Sem2">Semester 2</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Report Type</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        name="reportType"
                        label="Class Report (All Students)"
                        value="class"
                        checked={reportType === "class"}
                        onChange={(e) => setReportType(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                  </Form.Group>

                  <Alert variant="info">
                    <strong>Report includes:</strong> Attendance records, grade summaries, 
                    performance analytics, and participation metrics
                  </Alert>

                  <div className="text-end">
                    <Button
                      onClick={handleGenerateReport}
                      variant="primary"
                      size="lg"
                    >
                      📄 Generate & Download Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <Container>
          <span className="navbar-brand fw-bold d-flex align-items-center">
            <Mortarboard className="me-2" />
            TrackMate Teacher Portal
          </span>
        </Container>
      </nav>

      <Container fluid className="flex-grow-1 py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-3">
                <Nav variant="pills" className="flex-column">
                  <Nav.Link
                    active={activeTab === "classes"}
                    onClick={() => setActiveTab("classes")}
                    className="d-flex align-items-center py-3"
                  >
                    <Book className="me-2" />
                    View Classes
                  </Nav.Link>
                  <Nav.Link
                    active={activeTab === "attendance"}
                    onClick={() => setActiveTab("attendance")}
                    className="d-flex align-items-center py-3"
                  >
                    <ClipboardData className="me-2" />
                    Mark Attendance
                  </Nav.Link>
                  <Nav.Link
                    active={activeTab === "grades"}
                    onClick={() => setActiveTab("grades")}
                    className="d-flex align-items-center py-3"
                  >
                    <Award className="me-2" />
                    Add Grades
                  </Nav.Link>
                  <Nav.Link
                    active={activeTab === "reports"}
                    onClick={() => setActiveTab("reports")}
                    className="d-flex align-items-center py-3"
                  >
                    <BarChartFill className="me-2" />
                    Generate Reports
                  </Nav.Link>
                  <hr className="my-2" />
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className="d-flex align-items-center py-2"
                  >
                    <BoxArrowRight/>
                    Logout
                  </Button>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            {message && (
              <Alert
                variant={
                  message.includes("✅") ? "success" : 
                  message.includes("⚠️") ? "warning" : "danger"
                }
                className="mb-4"
                dismissible
                onClose={() => setMessage("")}
              >
                {message}
              </Alert>
            )}
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TeacherDashboard;