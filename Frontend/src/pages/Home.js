import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import AuthModal from "../components/AuthModal";
import "./Home.css";

import womanGroup from "../assets/images/woman-group.jpeg";
import iconCommunity from "../assets/images/icon-community.png";
import iconAnonymous from "../assets/images/icon-anonymous.png";
import iconTools from "../assets/images/icon-tools.png";
import iconResources from "../assets/images/icon-resources.png";

function Home() {
  const { loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    { img: iconCommunity, title: "Supportive Community", text: "Connect with women across the world in a safe, uplifting environment." },
    { img: iconAnonymous, title: "Anonymous Sharing", text: "Share your thoughts freely with optional anonymous posting." },
    { img: iconTools, title: "Self-Help Tools", text: "Access journals, reflection tools, and personal growth resources." },
    { img: iconResources, title: "Resources for Women", text: "Find curated wellness and empowerment resources created for women." },
  ];

  if (loading) return null; // optional: add a loader

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="home-section hero">
        <div className="home-content">
          <h1>Welcome to EmpowerHer+</h1>
          <p>
            A platform to connect, share, and grow together. Join a community dedicated to empowering women through knowledge, support, and inspiration.
          </p>
          <button className="join-button" onClick={() => setShowAuthModal(true)}>
            Join the Community
          </button>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* INFO SECTION */}
      <section className="info-section">
        <motion.div className="info-text" initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2>Empower. Inspire. Connect.</h2>
          <p>
            EmpowerHer+ is more than a community — it’s a movement. We believe in building a safe and inclusive space where women can share experiences, connect, uplift one another, and discover their voices.
          </p>
        </motion.div>
        <motion.div className="info-image" initial={{ opacity: 0, x: 80 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <img src={womanGroup} alt="Woman Group" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2 className="features-title">What EmpowerHer+ Offers</h2>
        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div key={i} className="feature-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.2 }} viewport={{ once: true }}>
              <img src={feature.img} alt={feature.title} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
