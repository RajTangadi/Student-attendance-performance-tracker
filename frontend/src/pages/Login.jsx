import { useContext, useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi";
import { AuthContext } from "../context/AuthContext";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const data = await loginUser(email, password);
      login(data);
      setMessage("Login successful!");
      
      if (data?.user?.role === "Admin") {
        navigate("/admin");
      } else if (data?.user?.role === "Teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navigation />
      
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-2 p-3 d-inline-flex mb-3">
                    <span className="text-white fs-2">🔐</span>
                  </div>
                  <h2 className="text-primary fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your TrackMate account</p>
                </div>
                
                {message && (
                  <Alert
                    variant={message === "Login successful!" ? "success" : "danger"}
                    className="mb-4"
                  >
                    {message}
                  </Alert>
                )}
                
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-3 border-0 bg-light"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-3 border-0 bg-light"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-3 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <a href="/register" className="text-primary text-decoration-none fw-semibold">
                      Create Account
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
}

export default Login;