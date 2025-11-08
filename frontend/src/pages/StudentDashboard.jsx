import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Nav,
  Button,
  Form,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart
} from "recharts";
import { Mortarboard, CalendarEvent, Award, GraphUp, PersonCircle } from "react-bootstrap-icons";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  fetchPerformanceByStudent,
  getAttendanceByStudent,
} from "../api/teacherApi";

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [semester, setSemester] = useState("");

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.user?.studentId) {
        const attendanceResponse = await getAttendanceByStudent(
          user?.user?.studentId
        );
        const attendanceData = attendanceResponse.data.attendance;
        const processedAttendance = attendanceData.map((record) => ({
          date: new Date(record.date).toISOString().split("T")[0],
          status: record.status,
        }));

        const totalDays = processedAttendance.length;
        const presentDays = processedAttendance.filter(
          (a) => a.status === "Present"
        ).length;

        const percentage =
          totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        setAttendance(processedAttendance);
        setAttendancePercentage(percentage);
      }

      const performanceResponse = await fetchPerformanceByStudent(
        user?.user?.studentId,
        semester
      );
      setPerformanceData(performanceResponse.data.records);
    };

    fetchData();
  }, [user?.user?.studentId, semester]);

  useEffect(() => {
    if (performanceData.length > 0) {
      const subjects = Object.entries(performanceData[0])
        .filter(([key]) =>
          ["english", "maths", "science", "geography", "social", "it"].includes(
            key
          )
        )
        .map(([subject, marks]) => ({
          subject: subject.charAt(0).toUpperCase() + subject.slice(1),
          marks,
        }));
      setMarks(subjects);
    }
  }, [performanceData]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getGradeFromMarks = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 35) return "D";
    return "F";
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        const OverviewChartData =
          performanceData && performanceData.length > 0
            ? [
                { subject: "English", marks: performanceData[0].english },
                { subject: "Geography", marks: performanceData[0].geography },
                { subject: "IT", marks: performanceData[0].it },
                { subject: "Maths", marks: performanceData[0].maths },
                { subject: "Science", marks: performanceData[0].science },
                { subject: "Social", marks: performanceData[0].social },
              ]
            : [];

        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">📊 Dashboard Overview</h2>
                <p className="text-muted">Welcome to your student portal</p>
              </Col>
            </Row>

            <Row className="g-3 mb-4">
              <Col xs={12} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <CalendarEvent className="text-primary me-2" size={24} />
                      <h5 className="fw-bold mb-0">Attendance Percentage</h5>
                    </div>
                    <div className="text-center mb-3">
                      <div className="h1 fw-bold text-primary">
                        {attendancePercentage}%
                      </div>
                      <p className="text-muted mb-0">Overall Attendance</p>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className={`progress-bar ${
                          attendancePercentage >= 75 ? "bg-success" : "bg-warning"
                        }`}
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <Award className="text-success me-2" size={24} />
                      <h5 className="fw-bold mb-0">Quick Stats</h5>
                    </div>
                    <div className="space-y-2">
                      <div className="d-flex justify-between">
                        <span className="text-muted">Total Subjects</span>
                        <strong>{marks?.length > 0 ? marks.length : "—"}</strong>
                      </div>
                      <div className="d-flex justify-between">
                        <span className="text-muted">Average Marks</span>
                        <strong>
                          {marks?.length > 0
                            ? Math.round(
                                marks.reduce((acc, m) => acc + m.marks, 0) /
                                  marks.length
                              )
                            : "—"}
                        </strong>
                      </div>
                      <div className="d-flex justify-between">
                        <span className="text-muted">Present Days</span>
                        <strong>
                          {attendance.filter((a) => a.status === "Present").length}/
                          {attendance.length}
                        </strong>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <GraphUp className="text-info me-2" size={24} />
                  <h5 className="fw-bold mb-0">Performance Overview</h5>
                </div>
                {OverviewChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={OverviewChartData}>
                      <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="marks"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Marks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted text-center py-4">
                    Performance data not available.
                  </p>
                )}
              </Card.Body>
            </Card>
          </>
        );

      case "attendance":
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <CalendarEvent className="text-primary me-2" size={24} />
                <h4 className="fw-bold mb-0">Attendance History</h4>
              </div>
              <div className="table-responsive">
                <Table hover>
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{a.date}</td>
                        <td>
                          <Badge
                            bg={a.status === "Present" ? "success" : "danger"}
                          >
                            {a.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        );

      case "marks":
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <Award className="text-primary me-2" size={24} />
                  <h4 className="fw-bold mb-0">Marks & Grades</h4>
                </div>
                <Form.Select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="">Select Semester</option>
                  <option value="Sem1">Semester 1</option>
                  <option value="Sem2">Semester 2</option>
                </Form.Select>
              </div>

              {semester ? (
                performanceData && performanceData.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Subject</th>
                          <th>Marks</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { subject: "English", marks: performanceData[0].english },
                          { subject: "Geography", marks: performanceData[0].geography },
                          { subject: "IT", marks: performanceData[0].it },
                          { subject: "Maths", marks: performanceData[0].maths },
                          { subject: "Science", marks: performanceData[0].science },
                          { subject: "Social Science", marks: performanceData[0].social },
                        ].map((m, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{m.subject}</td>
                            <td>{m.marks}</td>
                            <td>
                              <Badge bg="primary">
                                {getGradeFromMarks(m.marks)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted text-center py-4">
                    No data available for {semester}.
                  </p>
                )
              ) : (
                <p className="text-muted text-center py-4">
                  Please select a semester to view marks.
                </p>
              )}
            </Card.Body>
          </Card>
        );

      case "performance":
        const chartData =
          performanceData && performanceData.length > 0
            ? [
                { subject: "English", marks: performanceData[0].english },
                { subject: "Geography", marks: performanceData[0].geography },
                { subject: "IT", marks: performanceData[0].it },
                { subject: "Maths", marks: performanceData[0].maths },
                { subject: "Science", marks: performanceData[0].science },
                { subject: "Social Science", marks: performanceData[0].social },
              ]
            : [];

        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <GraphUp className="text-primary me-2" size={24} />
                  <h4 className="fw-bold mb-0">Performance Chart</h4>
                </div>
                <Form.Select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="">Select Semester</option>
                  <option value="Sem1">Semester 1</option>
                  <option value="Sem2">Semester 2</option>
                </Form.Select>
              </div>

              {semester ? (
                chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="marks"
                        stroke="#2563eb"
                        strokeWidth={3}
                        name="Marks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted text-center py-4">
                    No performance data found for {semester}.
                  </p>
                )
              ) : (
                <p className="text-muted text-center py-4">
                  Please select a semester to view performance chart.
                </p>
              )}
            </Card.Body>
          </Card>
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
            TrackMate Student Portal
          </span>
          <div className="navbar-nav ms-auto">
            <div className="d-flex align-items-center text-white">
              <PersonCircle className="me-2" />
              <span>{user?.user?.name || "Student"}</span>
            </div>
          </div>
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
                    active={activeSection === "overview"}
                    onClick={() => setActiveSection("overview")}
                    className="d-flex align-items-center py-3"
                  >
                    <Mortarboard className="me-2" />
                    Overview
                  </Nav.Link>
                  <Nav.Link
                    active={activeSection === "attendance"}
                    onClick={() => setActiveSection("attendance")}
                    className="d-flex align-items-center py-3"
                  >
                    <CalendarEvent className="me-2" />
                    Attendance
                  </Nav.Link>
                  <Nav.Link
                    active={activeSection === "marks"}
                    onClick={() => setActiveSection("marks")}
                    className="d-flex align-items-center py-3"
                  >
                    <Award className="me-2" />
                    Marks & Grades
                  </Nav.Link>
                  <Nav.Link
                    active={activeSection === "performance"}
                    onClick={() => setActiveSection("performance")}
                    className="d-flex align-items-center py-3"
                  >
                    <GraphUp className="me-2" />
                    Performance
                  </Nav.Link>
                  <hr className="my-2" />
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className="d-flex align-items-center py-2"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Button>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;