// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            File Sharing App
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/register" className="navbar-item">
              Register
            </Link>
            <Link to="/login" className="navbar-item">
              Login
            </Link>
            <Link to="/upload" className="navbar-item">
              Upload
            </Link>
            <Link to="/files" className="navbar-item">
              Files
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
