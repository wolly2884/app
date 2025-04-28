import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUser, FaLaptopCode, FaBlog, FaEnvelope } from 'react-icons/fa';
import './Sidebar.css';

// New Home Screen Component
function HomeScreen() {
  return (
    <div className="content">
      <h1>Welcome to the Home Screen</h1>
      <p>This is the Home page of your application.</p>
    </div>
  );
}

// Main App Component
function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="app">
        <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-header">
            <h3>{isOpen ? '' : ''}</h3>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <FaHome />
                {isOpen && <span className="menu-text">Home</span>}
                {!isOpen && (
                  <span className="tooltip">
                    <span className="tooltip-icon"><FaHome /></span>
                    Home
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <FaUser />
                {isOpen && <span className="menu-text">About</span>}
                {!isOpen && (
                  <span className="tooltip">
                    <span className="tooltip-icon"><FaUser /></span>
                    About
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <FaLaptopCode />
                {isOpen && <span className="menu-text">Services</span>}
                {!isOpen && (
                  <span className="tooltip">
                    <span className="tooltip-icon"><FaLaptopCode /></span>
                    Services
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <FaBlog />
                {isOpen && <span className="menu-text">Blog</span>}
                {!isOpen && (
                  <span className="tooltip">
                    <span className="tooltip-icon"><FaBlog /></span>
                    Blog
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <FaEnvelope />
                {isOpen && <span className="menu-text">Contact</span>}
                {!isOpen && (
                  <span className="tooltip">
                    <span className="tooltip-icon"><FaEnvelope /></span>
                    Contact
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
          <div className="profile-section">
            <img
              className="profile-picture"
              src={`${process.env.PUBLIC_URL}/bradesco.svg`}
              alt="Profile"
            />
            {isOpen && (
              <div className="profile-details">
                <p className="profile-name">Bradesco</p>
                <p className="profile-role">Plano de Saúde</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area with Routes */}
        <div className="content">
          <Routes>
            <Route path="/home" element={<HomeScreen />} />
            {/* Add more routes for other screens as needed */}
            <Route
              path="/about"
              element={
                <div className="content">
                  <h1>About Page</h1>
                  <p>This is the About page.</p>
                </div>
              }
            />
            <Route
              path="/services"
              element={
                <div className="content">
                  <h1>Services Page</h1>
                  <p>This is the Services page.</p>
                </div>
              }
            />
            <Route
              path="/blog"
              element={
                <div className="content">
                  <h1>Blog Page</h1>
                  <p>This is the Blog page.</p>
                </div>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="content">
                  <h1>Contact Page</h1>
                  <p>This is the Contact page.</p>
                </div>
              }
            />
            {/* Default route */}
            <Route
              path="/"
              element={
                <div className="content">
                  <h1>Main Content Area</h1>
                  <p>This is the main content of your application.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;