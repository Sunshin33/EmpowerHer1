import React from "react";
import "./ReadPostSkeleton.css";

function ReadPostSkeleton() {
  return (
    <div className="reader-skeleton">
      {/* Sticky Header Skeleton */}
      <div className="reader-skeleton-header" />

      <div className="reader-skeleton-container">
        {/* Title */}
        <div className="skeleton skeleton-title" />

        {/* Meta */}
        <div className="skeleton skeleton-meta" />

        {/* Hero */}
        <div className="skeleton skeleton-hero" />

        {/* Paragraphs */}
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />

        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

export default ReadPostSkeleton;
