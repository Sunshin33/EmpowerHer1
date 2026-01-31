import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      
      <div className="navbar-logo">EmpowerHer+</div>

      <ul className="navbar-links"> 
        <li>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        Home
        </NavLink>
        </li>

        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
