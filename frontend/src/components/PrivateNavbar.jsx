import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogData");

    toast.success("Logout successful", {
      position: "top-right",
      autoClose: true,
    });
    navigate("/login");
  };

  return (
    <nav className="primary-link">
      <div className="hamburger-icon" onClick={toggleMenu}>
        ☰ 
      </div>

      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <NavLink exact to="/" activeClassName="" onClick={toggleMenu}>
          Home
        </NavLink>

        {(auth.role === 1 || auth.role === 2) && (
          <NavLink to="/categories" activeClassName="" onClick={toggleMenu}>
            Categories
          </NavLink>
        )}

        <NavLink to="/posts" activeClassName="" onClick={toggleMenu}>
          Posts
        </NavLink>

        <NavLink to="/profile" activeClassName="" onClick={toggleMenu}>
          Profile
        </NavLink>

        <NavLink to="/setting" activeClassName="" onClick={toggleMenu}>
          Setting
        </NavLink>
        
        <NavLink
          to="/login"
          activeClassName=""
          onClick={handleLogout}
        >
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
