import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Alert } from 'react-bootstrap';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'react-bootstrap-icons';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const students = [
    { id: 1, name: 'John Doe', rollNo: '001', class: '10A' },
    { id: 2, name: 'Jane Smith', rollNo: '002', class: '10A' },
    { id: 3, name: 'Mike Johnson', rollNo: '003', class: '10A' },
    { id: 4, name: 'Sarah Wilson', rollNo: '004', class: '10A' },
    { id: 5, name: 'David Brown', rollNo: '005', class: '10A' }
  ];

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = () => {
    console.log('Attendance submitted:', attendance);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      present: { bg: 'success', text: 'Present', icon: <CheckCircle className="me-1" /> },
      absent: { bg: 'danger', text: 'Absent', icon: <XCircle className="me-1" /> },
      late: { bg: 'warning', text: 'Late', icon: <AlertCircle className="me-1" /> }
    };
    
    const variant = variants[status] || variants.absent;
    return (
      <Badge bg={variant.bg} className="d-flex align-items-center">
        {variant.icon}
        {variant.text}
      </Badge>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Container className="my-4 py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary rounded-2 p-2 me-3">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-1">Attendance Management</h1>
                <p className="text-muted mb-0">Track and manage student attendance</p>
              </div>
            </div>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant="success" className="mb-4">
            <div className="d-flex align-items-center">
              <CheckCircle className="me-2" />
              Attendance marked successfully for {selectedDate}
            </div>
          </Alert>
        )}

        <Row className="mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Mark Attendance</h5>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-semibold mb-0 me-2">Date:</Form.Label>
                      <Form.Control
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: 'auto', display: 'inline-block' }}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSubmit}>
                      Save Attendance
                    </Button>
                  </div>
                </div>

                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="fw-semibold">{student.rollNo}</td>
                          <td>{student.name}</td>
                          <td>
                            <Badge bg="primary-subtle" text="primary">
                              {student.class}
                            </Badge>
                          </td>
                          <td>
                            {attendance[student.id] ? getStatusBadge(attendance[student.id]) : '-'}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Button
                                variant={attendance[student.id] === 'present' ? 'success' : 'outline-success'}
                                size="sm"
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                              >
                                Present
                              </Button>
                              <Button
                                variant={attendance[student.id] === 'absent' ? 'danger' : 'outline-danger'}
                                size="sm"
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                              >
                                Absent
                              </Button>
                              <Button
                                variant={attendance[student.id] === 'late' ? 'warning' : 'outline-warning'}
                                size="sm"
                                onClick={() => handleAttendanceChange(student.id, 'late')}
                              >
                                Late
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h6 className="fw-bold text-dark mb-3">Today's Summary</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Total Students</span>
                  <Badge bg="primary">{students.length}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Present</span>
                  <Badge bg="success">
                    {Object.values(attendance).filter(status => status === 'present').length}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Absent</span>
                  <Badge bg="danger">
                    {Object.values(attendance).filter(status => status === 'absent').length}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Late</span>
                  <Badge bg="warning">
                    {Object.values(attendance).filter(status => status === 'late').length}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold text-dark mb-3">Quick Actions</h6>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <Clock className="me-2" />
                    View Attendance Report
                  </Button>
                  <Button variant="outline-success" size="sm">
                    Export Today's Data
                  </Button>
                  <Button variant="outline-info" size="sm">
                    Send Notifications
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AttendancePage;