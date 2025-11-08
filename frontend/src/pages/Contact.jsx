import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowAlert(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
    
    setTimeout(() => setShowAlert(false), 5000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@trackmate.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon to Fri, 9AM to 6PM'
    },
    {
      icon: '🏢',
      title: 'Visit Us',
      details: 'CDAC Campus, Pune',
      description: 'Maharashtra, India - 411007'
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="display-5 fw-bold mb-4">
                Get in 
                <span className="text-warning"> Touch</span>
              </h1>
              <p className="lead mb-0 opacity-90">
                Have questions about TrackMate? We're here to help and would love to hear from you.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5 py-4">
        <Row className="g-4">
          {/* Contact Methods */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <h3 className="fw-bold text-dark mb-4">Contact Information</h3>
              <p className="text-muted mb-4">
                Reach out to us through any of these methods. We typically respond within 24 hours.
              </p>
              
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-0 shadow-sm mb-3 hover-lift">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-2 p-2 me-3">
                        <span className="text-primary fs-4">{method.icon}</span>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 text-dark">{method.title}</h6>
                        <p className="text-primary fw-semibold mb-1">{method.details}</p>
                        <small className="text-muted">{method.description}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* Contact Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-2">Send us a Message</h3>
                  <p className="text-muted">Fill out the form below and we'll get back to you soon</p>
                </div>

                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <span className="fs-5 me-2">✅</span>
                      <div>
                        <strong>Thank you for your message!</strong>
                        <div className="small">We'll get back to you within 24 hours.</div>
                      </div>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold text-dark">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold text-dark">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold text-dark">Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is this regarding?"
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold text-dark">Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Tell us how we can help you..."
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="text-center mt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="px-5 py-3 fw-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Contact;