import React from "react";
import "./UserNavbar.css";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaUser,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaHandsHelping,
} from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";

function UserNavbar() {
  const { logout } = useAuth();

  return (
    <nav className="user-navbar">
      <div className="user-navbar-logo">EmpowerHer+</div>

      <ul className="user-navbar-links">
        <li>
          <NavLink to="/community">
            <FaUsers />
          </NavLink>
        </li>



        <li>
          <NavLink to="/profile">
            <FaUser />
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard">
            <FaChartBar />
          </NavLink>
        </li>

        <li>
          <NavLink to="/resources">
            <FaHandsHelping />
          </NavLink>
        </li>
        <li>
          <NavLink to="/usersettings">
            <FaCog />
          </NavLink>
        </li>
      </ul>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt />
      </button>
    </nav>
  );
}

export default UserNavbar;
