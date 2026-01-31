import React from "react";
import { motion } from "framer-motion";
import "./About.css";

import kwaeza from "../assets/images/kwaeza.png";
import { FaGithub, FaEnvelope } from "react-icons/fa";

function About() {
  const heroContent = [
    {
      title: "About EmpowerHer+",
      text: "EmpowerHer+ is a platform dedicated to empowering women by cultivating self-expression, mental well-being, and community connection. It aims to provide a supportive environment where every woman can grow, share, and thrive.",
      animation: { x: -60 },
    },
    {
      title: "What Motivated This Project",
      text: "This platform was inspired by the need for a safe and uplifting community where women can express themselves without judgment. EmpowerHer+ reflects the desire to support mental wellness, build emotional resilience, and create a meaningful space for women to connect, share experiences, and empower one another.",
      animation: { x: 60 },
    },
  ];

  const founders = [
    {
      name: "Nandy Kwaeza Alexandre Bila",
      role: "Founder & Developer",
      bio: "I always knew I wanted to create things to uplift and empower people. With EmpowerHer+, I am able to create a safe space for myself and other women to express ourselves.",
      image: kwaeza,
      socialLinks: [
        { platform: "email", url: "mailto:nandybila2002@gmail.com" },
        { platform: "github", url: "https://github.com/Sunshin33" },
      ],
    },
  ];

  const iconMap = {
    github: <FaGithub color="#fff" />,
    email: <FaEnvelope color="#fff" />,
  };

  return (
    <div className="about-container">
      {/* HERO SECTION */}
      <section className="about-page">
        <div className="about-two-columns">
          {heroContent.map((box, i) => (
            <motion.div
              key={i}
              className="about-content"
              initial={{ opacity: 0, x: box.animation.x }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1>{box.title}</h1>
              <p>{box.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="founder-section">
        <h2>Founder</h2>
        {founders.map((f, i) => (
          <div key={i} className="founder-card">
            <img src={f.image} alt={f.name} />
            <div className="founder-info">
              <h3>{f.name}</h3>
              <p>{f.role}</p>
              <p className="bio">{f.bio}</p>
              <div className="social-links">
                {f.socialLinks.map((s, j) => (
                  <a
                    key={j}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-pink-outline`}
                    style={{ marginRight: "10px" }}
                  >
                    {iconMap[s.platform] || s.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default About;
