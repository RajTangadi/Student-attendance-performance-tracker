import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Table, Form, Modal, Alert, Badge } from "react-bootstrap";
import { PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,BarChart} from "recharts";
import { Mortarboard, PeopleFill, PersonPlusFill, PersonCheckFill, ClockFill, BarChartFill } from "react-bootstrap-icons";




import { AuthContext } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  createStudent,
  createTeacher,
  deleteStudentById,
  deleteTeacherById,
  getAllStudents,
  getAllTeacher,
  updateStudentById,
  updateTeacherById,
} from "../api/adminApi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    class: "",
    year: "",
  });
  const [message, setMessage] = useState("");

  const { adminStats, updateAdminStats, incrementStudents, decrementStudents, incrementTeachers, decrementTeachers } = useAdmin();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const stats = [
    {
      title: "Total Students",
      value: adminStats.totalStudents,
      icon: <Mortarboard className="text-primary" size={24} />,
      color: "primary",
      change: "+12%"
    },
    {
      title: "Total Teachers",
      value: adminStats.totalTeachers,
      icon: <PeopleFill className="text-success" size={24} />,
      color: "success",
      change: "+5%"
    },
    {
      title: "Active Classes",
      value: adminStats.totalClasses,
      icon: <PersonCheckFill className="text-warning" size={24} />,
      color: "warning",
      change: "+3%"
    },
    {
      title: "Avg Attendance",
      value: "92%",
      icon: <ClockFill className="text-info" size={24} />,
      color: "info",
      change: "+2%"
    }
  ];

  const attendanceData = [
    { name: 'Present', value: 75 },
    { name: 'Absent', value: 15 },
    { name: 'Late', value: 7 },
    { name: 'Leave', value: 3 }
  ];

  const performanceData = [
    { subject: 'Math', avgMarks: 85 },
    { subject: 'Science', avgMarks: 78 },
    { subject: 'English', avgMarks: 82 },
    { subject: 'History', avgMarks: 75 },
    { subject: 'Geography', avgMarks: 80 }
  ];

  useEffect(() => {
    if (activeTab === "teachers") fetchTeachers();
    if (activeTab === "students") fetchStudents();
  }, [activeTab]);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeacher();
      setTeachers(data);
      updateAdminStats({ totalTeachers: data.length });
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
      updateAdminStats({ totalStudents: data.length });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name,
        email: item.email,
        subject: item.subject || "",
        class: item.class || "",
        year: item.year || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", subject: "", class: "", year: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", email: "", subject: "", class: "", year: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "student") {
        if (editingId) {
          const updatedStudent = await updateStudentById(editingId, formData);
          setStudents(students.map((t) => (t._id === editingId ? updatedStudent : t)));
          setMessage("✅ Student updated successfully!");
        } else {
          const newStudent = await createStudent(formData);
          setStudents([...students, newStudent]);
          setMessage("✅ Student added successfully!");
          incrementStudents();
        }
      } else if (modalType === "teacher") {
        if (editingId) {
          const updatedTeacher = await updateTeacherById(editingId, formData);
          setTeachers(teachers.map((t) => (t._id === editingId ? updatedTeacher : t)));
          setMessage("✅ Teacher updated successfully!");
        } else {
          const data = await createTeacher(formData);
          setTeachers([...teachers, data]);
          setMessage("✅ Teacher added successfully!");
          incrementTeachers();
        }
      }
      closeModal();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Error saving data");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === "teacher") {
          await deleteTeacherById(id);
          setTeachers((prev) => prev.filter((t) => t._id !== id));
          setMessage("🗑️ Teacher deleted successfully!");
          decrementTeachers();
        } else {
          await deleteStudentById(id);
          setStudents((prev) => prev.filter((s) => s._id !== id));
          setMessage("🗑️ Student deleted successfully!");
          decrementStudents();
        }
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error deleting record");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">📊 Dashboard Overview</h2>
                <p className="text-muted">Welcome to your administration dashboard</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="g-3 mb-4">
              {stats.map((stat, index) => (
                <Col key={index} xs={12} sm={6} lg={3}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-2">{stat.title}</h6>
                          <h3 className="fw-bold text-dark">{stat.value}</h3>
                          <Badge bg={`${stat.color}-subtle`} text={stat.color}>
                            {stat.change}
                          </Badge>
                        </div>
                        <div className={`bg-${stat.color}-subtle p-2 rounded`}>
                          {stat.icon}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Charts */}
            <Row className="g-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold text-dark mb-4">Attendance Distribution</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {attendanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold text-dark mb-4">Performance by Subject</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgMarks" fill="#3b82f6" name="Average Marks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );

      case "students":
        const filteredStudents = students.filter(
          (s) =>
            (selectedYear ? s.year === selectedYear : true) &&
            (selectedClass ? s.class === selectedClass : true)
        );

        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">👨‍🎓 Student Management</h2>
                <p className="text-muted">Manage student records and information</p>
              </Col>
              <Col xs="auto">
                <Button variant="primary" onClick={() => openModal("student")}>
                  <PersonPlusFill className="me-2" />
                  Add Student
                </Button>
              </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Label>Filter by Year</Form.Label>
                <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value="">All Years</option>
                  {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Filter by Class</Form.Label>
                <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  <option value="">All Classes</option>
                  {["7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Students Table */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student._id}>
                          <td className="fw-semibold">{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <Badge bg="primary-subtle" text="primary">
                              {student.class}
                            </Badge>
                          </td>
                          <td>{student.year}</td>
                          <td>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-2"
                              onClick={() => openModal("student", student)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete("student", student._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </>
        );

      case "teachers":
        return (
          <>
            <Row className="mb-4">
              <Col>
                <h2 className="fw-bold text-dark">👨‍🏫 Teacher Management</h2>
                <p className="text-muted">Manage teacher records and information</p>
              </Col>
              <Col xs="auto">
                <Button variant="success" onClick={() => openModal("teacher")}>
                  <PersonPlusFill className="me-2" />
                  Add Teacher
                </Button>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="fw-semibold">{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td>
                            <Badge bg="success-subtle" text="success">
                              {teacher.subject}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-2"
                              onClick={() => openModal("teacher", teacher)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete("teacher", teacher._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
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
            TrackMate Admin
          </span>
          <div className="navbar-nav ms-auto">
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </nav>

      <Container fluid className="flex-grow-1 py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-3">
                <nav className="nav flex-column">
                  <button
                    className={`nav-link text-start d-flex align-items-center p-3 rounded ${
                      activeTab === "dashboard" ? "bg-primary text-white" : "text-dark"
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <BarChartFill className="me-2" />

                    Dashboard
                  </button>
                  <button
                    className={`nav-link text-start d-flex align-items-center p-3 rounded ${
                      activeTab === "students" ? "bg-primary text-white" : "text-dark"
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    <Mortarboard className="me-2" />
                    Students
                  </button>
                  <button
                    className={`nav-link text-start d-flex align-items-center p-3 rounded ${
                      activeTab === "teachers" ? "bg-primary text-white" : "text-dark"
                    }`}
                    onClick={() => setActiveTab("teachers")}
                  >
                    <PeopleFill className="me-2" />
                    Teachers
                  </button>
                </nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            {message && (
              <Alert 
                variant={message.includes("✅") || message.includes("🗑️") ? "success" : "danger"} 
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

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit" : "Add"} {modalType === "teacher" ? "Teacher" : "Student"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter email address"
              />
            </Form.Group>
            {modalType === "teacher" ? (
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Enter subject"
                />
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  >
                    <option value="">Select Class</option>
                    {["7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  >
                    <option value="">Select Year</option>
                    {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;