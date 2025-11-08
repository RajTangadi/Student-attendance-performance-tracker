import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const HomePage = () => {
  const features = [
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Comprehensive performance tracking with interactive charts and detailed reports",
      link: "/student",
      variant: "primary"
    },
    {
      icon: "👥",
      title: "Attendance Management",
      description: "Streamlined attendance tracking with real-time updates and reporting",
      link: "/teacher",
      variant: "success"
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      description: "Role-based access control ensuring data security and privacy compliance",
      link: "/admin",
      variant: "warning"
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor student progress with visual analytics and performance insights",
      link: "/student",
      variant: "info"
    },
    {
      icon: "👨‍🏫",
      title: "Teacher Dashboard",
      description: "Complete classroom management with student analytics and attendance tools",
      link: "/teacher",
      variant: "danger"
    },
    {
      icon: "⚙️",
      title: "Admin Controls",
      description: "Comprehensive system management and user administration capabilities",
      link: "/admin",
      variant: "dark"
    }
  ];

  const stats = [
    { number: "95%", label: "Accuracy Rate" },
    { number: "50+", label: "Schools Trust Us" },
    { number: "10K+", label: "Students Tracked" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 fs-6">
                🎯 Trusted by Educational Institutions
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Streamline Student Success with 
                <span className="text-warning"> Smart Tracking</span>
              </h1>
              <p className="lead mb-4 opacity-90">
                A comprehensive platform designed for modern educational institutions to manage 
                student attendance, track academic performance, and drive better learning outcomes 
                through data-driven insights.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <LinkContainer to="/register">
                  <Button variant="warning" size="lg" className="px-4 py-2 fw-semibold">
                    Start Free Trial
                  </Button>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Button variant="outline-light" size="lg" className="px-4 py-2 fw-semibold">
                    Live Demo
                  </Button>
                </LinkContainer>
              </div>
              
              {/* Stats */}
              <Row className="mt-5 pt-3">
                {stats.map((stat, index) => (
                  <Col key={index} xs={6} sm={3}>
                    <div className="text-center">
                      <div className="h3 fw-bold text-warning mb-1">{stat.number}</div>
                      <div className="small opacity-90">{stat.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-white rounded-3 shadow-lg p-4 d-inline-block">
                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-primary rounded-2 p-3 text-white">
                      <div className="h5 mb-0">95%</div>
                      <small>Attendance</small>
                    </div>
                    <div className="bg-success rounded-2 p-3 text-white">
                      <div className="h5 mb-0">A-</div>
                      <small>Avg Grade</small>
                    </div>
                    <div className="bg-info rounded-2 p-3 text-white">
                      <div className="h5 mb-0">12</div>
                      <small>Courses</small>
                    </div>
                  </div>
                  <div className="bg-light rounded-2 p-3">
                    <div className="text-start">
                      <div className="fw-bold text-dark mb-2">Performance Overview</div>
                      <div className="progress mb-2" style={{height: '8px'}}>
                        <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                      </div>
                      <div className="progress mb-2" style={{height: '8px'}}>
                        <div className="progress-bar bg-primary" style={{width: '92%'}}></div>
                      </div>
                      <div className="progress" style={{height: '8px'}}>
                        <div className="progress-bar bg-warning" style={{width: '78%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="outline-primary" text="primary" className="mb-3 px-3 py-2">
                Features
              </Badge>
              <h2 className="display-5 fw-bold text-dark mb-3">
                Everything You Need to 
                <span className="text-primary"> Track Success</span>
              </h2>
              <p className="lead text-muted">
                Comprehensive tools designed for administrators, teachers, and students to 
                optimize educational outcomes through data-driven insights.
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} xs={12} md={6} lg={4}>
                <LinkContainer to={feature.link}>
                  <Card className="border-0 shadow-sm h-100 feature-card hover-lift">
                    <Card.Body className="p-4 text-center">
                      <div className={`bg-${feature.variant} bg-opacity-10 rounded-3 d-inline-flex justify-content-center align-items-center mb-4`} 
                           style={{width: '80px', height: '80px'}}>
                        <span style={{fontSize: '32px'}}>{feature.icon}</span>
                      </div>
                      <Card.Title className="fw-bold fs-5 text-dark mb-3">
                        {feature.title}
                      </Card.Title>
                      <Card.Text className="text-muted mb-4">
                        {feature.description}
                      </Card.Text>
                      <Button 
                        variant={feature.variant} 
                        className="px-4"
                        size="sm"
                      >
                        Explore Feature
                      </Button>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h3 className="h2 fw-bold mb-3">Ready to Transform Your Institution?</h3>
              <p className="lead mb-0 opacity-90">
                Join hundreds of educational institutions already using our platform to drive student success.
              </p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">
                <LinkContainer to="/register">
                  <Button variant="warning" size="lg" className="px-4">
                    Get Started Today
                  </Button>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Button variant="outline-light" size="lg" className="px-4">
                    Sign In
                  </Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Platform Overview */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <Badge bg="outline-primary" text="primary" className="mb-3 px-3 py-2">
                Platform Overview
              </Badge>
              <h2 className="display-6 fw-bold text-dark mb-4">
                Designed for Every Role in Education
              </h2>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-2 p-2 me-3">
                    <span className="text-primary fs-4">👨‍💼</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Administrators</h5>
                    <p className="text-muted mb-0">Complete system oversight and analytics</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-2 p-2 me-3">
                    <span className="text-success fs-4">👩‍🏫</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Teachers</h5>
                    <p className="text-muted mb-0">Streamlined classroom management</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded-2 p-2 me-3">
                    <span className="text-info fs-4">🎓</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Students</h5>
                    <p className="text-muted mb-0">Personalized progress tracking</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="bg-primary rounded-3 p-4 text-black">
                <div className="row g-3 text-center">
                  <Col xs={6}>
                    <div className="bg-white bg-opacity-20 rounded-2 p-3">
                      <div className="h4 fw-bold mb-1">50+</div>
                      <div className="small" color="">Institutions</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-white bg-opacity-20 rounded-2 p-3">
                      <div className="h4 fw-bold mb-1">10K+</div>
                      <div className="small">Active Users</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-white bg-opacity-20 rounded-2 p-3">
                      <div className="h4 fw-bold mb-1">95%</div>
                      <div className="small">Satisfaction</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-white bg-opacity-20 rounded-2 p-3">
                      <div className="h4 fw-bold mb-1">24/7</div>
                      <div className="small">Support</div>
                    </div>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;