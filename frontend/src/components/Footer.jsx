import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row className="g-4">
          <Col lg={4}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary rounded-2 p-2 me-3">
                <span className="text-white fs-4">🎯</span>
              </div>
              <div>
                <h5 className="fw-bold mb-0">TrackMate</h5>
                <small className="text-light">Student Success Platform</small>
              </div>
            </div>
            <p className="text-light opacity-75 mb-3">
              Empowering educational institutions with smart attendance tracking 
              and performance analytics for better student outcomes.
            </p>
            <div className="text-light opacity-75 small">
              <div>📧 support@trackmate.com</div>
              <div>📞 +91 98765 43210</div>
            </div>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h6 className="fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/admin" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Admin Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/teacher" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Teacher Portal
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/student" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <a href="#privacy" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={4} sm={6}>
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#help" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#docs" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#status" className="text-light opacity-75 text-decoration-none hover-text-primary">
                  System Status
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 border-light opacity-25" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-light opacity-75 small">
              © {new Date().getFullYear()} TrackMate. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="text-light opacity-75 small">
              
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;