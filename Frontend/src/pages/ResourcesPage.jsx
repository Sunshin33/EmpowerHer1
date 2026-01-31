import React, { useState } from "react";
import "./ResourcesPage.css";

const resourcesData = [
  {
    category: "Mental Health",
    title: "YourDOST",
    description: "Online counseling and emotional support platform.",
    link: "https://yourdost.com",
    type: "Website",
  },
  {
    category: "Mental Health",
    title: "StrongMinds",
    description: "Free depression treatment for women in Africa.",
    link: "https://strongminds.org",
    type: "Website",
  },
  {
    category: "Women Empowerment",
    title: "UN Women",
    description: "Global organization for women's rights and equality.",
    link: "https://www.unwomen.org",
    type: "Website",
  },
  {
    category: "Mozambique",
    title: "WLSA Mozambique",
    description: "Legal aid and protection for women in Mozambique.",
    link: "https://www.wlsa.org.mz",
    type: "Website",
  },
  {
    category: "Mozambique",
    title: "Gender Links",
    description: "Gender justice and women empowerment in Southern Africa.",
    link: "https://genderlinks.org.za",
    type: "Website",
  },
  {
    category: "Mozambique",
    title: "LeMuSiCa & LUARTE",
    description: "Psychosocial assistance, and community education on GBV and recovery.",
    link: "https://www.unicef.org/mozambique",
    type: "Website",
  },
  {
    category: "Mozambique",
    title: "UNFPA Mozambique",
    description: "UN agency with programmes focused on sexual and reproductive health services, rights, and protection for women and girls.",
    link: "https://mozambique.unfpa.org",
    type: "Website",
  },
  { 
    category: "Africa",
    title: "Girls for Girls Africa (G4G)",
    description: "Kenyan‑based survivor‑led foundation focused on mental health, trauma support, and empowerment for women and girls.",
    link: "https://www.g4gafrica.org",
    type: "Website",

  },
  {
    category: "Mental Health",
    title: "WHO Mental Health",
    description: "Global mental health resources and guidance.",
    link: "https://www.who.int/teams/mental-health-and-substance-use",
    type: "Website",
  },
  {
    category: "Education & Tools",
    title: "Therapy in a Nutshell",
    description: "Mental health education and coping tools.",
    link: "https://www.youtube.com/@TherapyinaNutshell",
    type: "YouTube",
  },
  {
    category: "Education & Tools",
    title: "Mel Robbins",
    description: "Motivation, confidence, and mindset tools for women.",
    link: "https://www.youtube.com/@melrobbins",
    type: "YouTube",
  },
  {
    category: "Podcasts & Videos",
    title: "THE SLUMFLOWER HOUR",
    description: "Dating and relationship advice podcast by author & radical feminist Chidera Eggerue.",
    link: "https://www.youtube.com/@theslumflower",
    type: "YouTube",
  },
  {
    category: "Podcasts & Videos",
    title: "The Diary of a CEO",
    description: "Conversations with inspiring entrepreneurs and leaders.",
    link: "https://www.youtube.com/@TheDiaryOfACEO",
    type: "YouTube",
  },
  {
    category: "Podcasts & Videos",
    title: "Jasmin Siri",
    description: "Self-development and mindset coaching.",
    link: "https://www.youtube.com/@JasminSiri",
    type: "YouTube",
  },
  {
    category: "Podcasts & Videos",
    title: "The Sex & Psychology Podcast",
    description: "The sex ed you never got in school.",
    link: "https://www.youtube.com/@JustinLehmiller",
    type: "YouTube",
  },
];

const categories = [
  "All",
  "Mental Health",
  "Women Empowerment",
  "Africa", "Mozambique",
  "Education & Tools",
  "Podcasts & Videos",
];

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredResources =
    activeCategory === "All"
      ? resourcesData
      : resourcesData.filter(
          (resource) => resource.category === activeCategory
        );

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resources & Support</h1>
        <p>
          A curated gallery of tools, organizations, and guides to support your
          mental, physical, and emotional well-being.
        </p>
      </div>

      {/* Filters */}
      <div className="resources-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="resources-grid">
        {filteredResources.map((resource, index) => (
          <div className="resource-card" key={index}>
            <div className="resource-badge">{resource.type}</div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>

            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-btn"
            >
              Access Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
