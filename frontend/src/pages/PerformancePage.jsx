import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformancePage = () => {
  // Sample data for demonstration
  const performanceData = [
    { subject: 'Mathematics', marks: 85, average: 72 },
    { subject: 'Science', marks: 78, average: 68 },
    { subject: 'English', marks: 92, average: 75 },
    { subject: 'History', marks: 88, average: 70 },
    { subject: 'Geography', marks: 81, average: 65 },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Container className="my-4 py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary rounded-2 p-2 me-3">
                <span className="text-white fs-4">📈</span>
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-1">Performance Analytics</h1>
                <p className="text-muted mb-0">Detailed performance metrics and insights</p>
              </div>
            </div>
          </Col>
        </Row>

        <Alert variant="info" className="mb-4">
          <strong>Note:</strong> This page is under development. Advanced analytics features will be available soon.
        </Alert>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold text-dark mb-4">Subject-wise Performance</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="marks" fill="#3b82f6" name="Your Marks" />
                    <Bar dataKey="average" fill="#6b7280" name="Class Average" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold text-dark mb-4">Quick Stats</h5>
                <div className="space-y-3">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-primary bg-opacity-10 rounded">
                    <span className="fw-semibold">Overall Average</span>
                    <Badge bg="primary">84.8%</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded">
                    <span className="fw-semibold">Highest Score</span>
                    <Badge bg="success">92%</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-warning bg-opacity-10 rounded">
                    <span className="fw-semibold">Improvement Needed</span>
                    <Badge bg="warning">Science</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-info bg-opacity-10 rounded">
                    <span className="fw-semibold">Class Rank</span>
                    <Badge bg="info">#3</Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold text-dark mb-4">Performance Insights</h5>
                <Row className="g-3">
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 text-primary mb-2">📚</div>
                      <h6>Strong in Languages</h6>
                      <p className="text-muted small mb-0">Excellent performance in English and literature subjects</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 text-warning mb-2">🔬</div>
                      <h6>Science Improvement</h6>
                      <p className="text-muted small mb-0">Focus needed on scientific concepts and applications</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 text-success mb-2">📊</div>
                      <h6>Consistent Performer</h6>
                      <p className="text-muted small mb-0">Maintaining above average scores across subjects</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PerformancePage;