import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const About = () => {
  const features = [
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Comprehensive performance tracking with interactive charts and detailed reports to monitor student progress effectively.',
      color: 'primary'
    },
    {
      icon: '👥',
      title: 'Attendance Management',
      description: 'Streamlined attendance tracking with real-time updates and automated reporting for better classroom management.',
      color: 'success'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Role-based access control ensuring data security and privacy compliance with enterprise-grade protection.',
      color: 'warning'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor student progress with visual analytics and performance insights to identify areas for improvement.',
      color: 'info'
    }
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate' },
    { number: '50+', label: 'Schools Trust Us' },
    { number: '10K+', label: 'Students Tracked' },
    { number: '99.9%', label: 'Platform Uptime' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={8} className="mx-auto text-center">
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 fs-6">
                About TrackMate
              </Badge>
              <h1 className="display-5 fw-bold mb-4">
                Revolutionizing Education Through 
                <span className="text-warning"> Smart Tracking</span>
              </h1>
              <p className="lead mb-0 opacity-90">
                We're on a mission to transform how educational institutions manage student data, 
                track performance, and drive academic success through innovative technology solutions.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5 py-4">
        {/* Mission & Vision */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100 hover-lift">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-2 p-3 d-inline-flex mb-3">
                  <span className="text-primary fs-2">🎯</span>
                </div>
                <h4 className="text-primary mb-3 fw-bold">Our Mission</h4>
                <p className="text-muted mb-0">
                  To provide educational institutions with a comprehensive platform that simplifies 
                  attendance tracking and enhances student performance monitoring through innovative 
                  technology and user-friendly interfaces. We believe in empowering educators with 
                  data-driven insights to make informed decisions.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100 hover-lift">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 rounded-2 p-3 d-inline-flex mb-3">
                  <span className="text-success fs-2">🚀</span>
                </div>
                <h4 className="text-success mb-3 fw-bold">Our Vision</h4>
                <p className="text-muted mb-0">
                  To become the leading solution for educational management systems, empowering 
                  teachers and administrators with data-driven insights to improve student outcomes 
                  and institutional efficiency. We envision a future where every student's potential 
                  is maximized through intelligent tracking.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mb-5">
          <Col xs={12}>
            <div className="text-center mb-4">
              <Badge bg="outline-primary" text="primary" className="mb-3 px-3 py-2">
                Our Impact
              </Badge>
              <h2 className="display-6 fw-bold text-dark mb-4">
                Trusted by Educational Institutions
              </h2>
            </div>
            <Row className="g-4">
              {stats.map((stat, index) => (
                <Col key={index} xs={6} md={3}>
                  <div className="text-center p-4 bg-white rounded-3 shadow-sm">
                    <div className={`h2 fw-bold text-primary mb-2`}>{stat.number}</div>
                    <div className="text-muted fw-semibold">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Features Section */}
        <Row>
          <Col xs={12}>
            <div className="text-center mb-4">
              <Badge bg="outline-primary" text="primary" className="mb-3 px-3 py-2">
                Why Choose Us
              </Badge>
              <h2 className="display-6 fw-bold text-dark mb-4">
                Comprehensive Features for 
                <span className="text-primary"> Modern Education</span>
              </h2>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} xs={12} md={6}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                <Card.Body className="p-4">
                  <div className={`bg-${feature.color} bg-opacity-10 rounded-2 p-3 d-inline-flex mb-3`}>
                    <span className={`text-${feature.color} fs-2`}>{feature.icon}</span>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default About;