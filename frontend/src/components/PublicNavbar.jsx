import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="primary-link">
      <div className="hamburger-icon" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <NavLink to="/login" activeClassName="active-link" onClick={toggleMenu}>
          Login
        </NavLink>
        
        <NavLink to="/signup" activeClassName="active-link" onClick={toggleMenu}>
          Signup
        </NavLink>
      </div>
    </nav>
  );
};

export default PublicNavbar;
