import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import '../assets/nav.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-2 sticky-top">
      <Container>
        {/* Brand Logo */}
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center fw-bold text-decoration-none">
            <div className="bg-primary rounded-2 p-2 me-2 d-flex align-items-center justify-content-center">
              <span className="text-white fs-5">🎯</span>
            </div>
            <div className="d-flex flex-column">
              <span className="text-dark fs-4 fw-bold">TrackMate</span>
              <Badge bg="light" text="primary" className="fs-7 fw-normal border border-primary">
                EduTech
              </Badge>
            </div>
          </Navbar.Brand>
        </LinkContainer>
        
        {/* Mobile Toggle */}
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0"
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        
        {/* Navigation Items */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center Navigation Links */}
          <Nav className="mx-auto">
            {navItems.map((item) => (
              <LinkContainer key={item.path} to={item.path}>
                <Nav.Link 
                  className={`mx-2 px-3 py-2 fw-semibold position-relative text-decoration-none ${
                    location.pathname === item.path 
                      ? 'text-primary' 
                      : 'text-dark opacity-75 hover-opacity-100 hover-text-primary'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="position-absolute bottom-0 start-50 translate-middle-x bg-primary rounded" 
                         style={{ width: '24px', height: '3px' }} />
                  )}
                </Nav.Link>
              </LinkContainer>
            ))}
          </Nav>
          
          {/* Auth Buttons */}
          <Nav className="flex-row gap-2 align-items-center">
            <LinkContainer to="/login">
              <Button 
                variant={location.pathname === '/login' ? 'primary' : 'outline-primary'} 
                size="sm"
                className="px-3 py-2 fw-semibold"
              >
                Sign In
              </Button>
            </LinkContainer>
            <LinkContainer to="/register">
              <Button 
                variant={location.pathname === '/register' ? 'primary' : 'outline-primary'} 
                size="sm"
                className="px-3 py-2 fw-semibold"
              >
                Get Started
              </Button>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;