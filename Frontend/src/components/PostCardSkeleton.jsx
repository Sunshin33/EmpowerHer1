import React from "react";
import "./PostCardSkeleton.css";

function PostCardSkeleton() {
  return (
    <div className="post-skeleton-card">
      {/* Header */}
      <div className="post-skeleton-header">
        <div className="post-skeleton-avatar" />
        <div className="post-skeleton-user">
          <div className="post-skeleton-line short" />
          <div className="post-skeleton-line tiny" />
        </div>
      </div>

      {/* Title */}
      <div className="post-skeleton-title" />

      {/* Body */}
      <div className="post-skeleton-body">
        <div className="post-skeleton-line" />
        <div className="post-skeleton-line" />
        <div className="post-skeleton-line medium" />
      </div>

      {/* Media */}
      <div className="post-skeleton-media" />

      {/* Footer */}
      <div className="post-skeleton-footer">
        <div className="post-skeleton-btn" />
        <div className="post-skeleton-btn" />
        <div className="post-skeleton-btn" />
      </div>
    </div>
  );
}

export default PostCardSkeleton;
