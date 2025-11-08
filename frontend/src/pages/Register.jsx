import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { registerUser } from "../api/userApi";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    secretCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate Email
    if (!emailRegex.test(formData.email)) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address (e.g., name@example.com).",
      });
      return;
    }

    // Validate Password
    if (!passwordRegex.test(formData.password)) {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        html: `
          Your password must include:
          <ul style="text-align:left; margin-top:10px;">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character (@$!%*?&)</li>
          </ul>
        `,
      });
      return;
    }

    // Secret code validation
    if (formData.role === "Teacher" && formData.secretCode !== "#tech12$") {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Secret code wrong!",
      });
      return;
    }

    if (formData.role === "Admin" && formData.secretCode !== "#admin12$") {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Secret code wrong!",
      });    
      return;
    }

    try {
      const data = await registerUser(formData);
      console.log("User registered:", data);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigation />
      
      <Container className="flex-grow-1 py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-2 p-3 d-inline-flex mb-3">
                    <span className="text-white fs-2">🚀</span>
                  </div>
                  <h2 className="text-primary fw-bold mb-2">Create Account</h2>
                  <p className="text-muted">Join TrackMate and transform education management</p>
                </div>
                
                {loading && <Loader />}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <Alert variant="success">
                    Registration successful! Redirecting to login...
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-0 bg-light py-3"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Create a strong password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="border-0 bg-light py-3"
                        />
                        <Form.Text className="text-muted">
                          Must include uppercase, lowercase, number, and special character
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Select Role</Form.Label>
                        <Form.Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="border-0 bg-light py-3"
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {(formData.role === "Teacher" || formData.role === "Admin") && (
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Secret Code</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter secret code for verification"
                            name="secretCode"
                            value={formData.secretCode}
                            onChange={handleChange}
                            required
                            className="border-0 bg-light py-3"
                          />
                          <Form.Text className="text-muted">
                            Required for {formData.role} registration
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-3 fw-semibold mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign In
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Register;