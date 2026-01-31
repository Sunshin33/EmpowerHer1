import React from "react";
import "./Footer.css";
import { FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* LEFT SIDE*/}
        <div className="footer-left">
          <h3>EmpowerHer+</h3>
        </div>

        {/* RIGHT SIDE - Social Links */}
        <div className="footer-right">
          <h4>Connect With Me</h4>

          <div className="social-links">
            <a 
              href="mailto:nandybila2002@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaEnvelope />
            </a>

            <a 
              href="https://instagram.com/queenofzhululand" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a 
              href="https://github.com/Sunshin33" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} EmpowerHer+ | Created by Nandy Kwaeza Alexandre Bila
      </div>
    </footer>
  );
}

export default Footer;
