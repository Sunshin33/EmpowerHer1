import React, { useEffect, useState } from "react";
import "./BackToTopLink.css";

function BackToTopLink() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`back-to-top-fab ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

export default BackToTopLink;
