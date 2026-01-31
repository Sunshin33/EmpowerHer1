import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../services/PostService";
import ReadPostSkeleton from "../components/ReadPostSkeleton";
import "./ReadPost.css";

function ReadPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) return <ReadPostSkeleton />;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      {/* Sticky Back Header */}
      <div className="reader-sticky-header">
        <button
          className="reader-back-btn"
          onClick={() => navigate("/community")}
        >
          ← Back to Community
        </button>
      </div>

      {/* Main Reader Container */}
      <div className="reader-container">
        {/* Header */}
        <div className="reader-header">
          <h1 className="reader-title">{post.title}</h1>

          <div className="reader-meta">
            <span className="reader-author">
              {post.anonymous ? "Anonymous" : post.user?.fullName}
            </span>

            <span className="meta-dot">•</span>

            <span className="reader-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <hr className="reader-divider" />

        {/* Hero Media */}
        {post.mediaUrl && post.contentType === "image" && (
          <img
            className="reader-hero-image"
            src={post.mediaUrl}
            alt=""
          />
        )}

        {post.mediaUrl && post.contentType === "video" && (
          <video
            className="reader-hero-video"
            src={post.mediaUrl}
            controls
          />
        )}

        {post.mediaUrl &&
          (post.contentType === "pdf" ||
            post.contentType === "doc") && (
            <div className="reader-file">
              📎{" "}
              <a
                href={post.mediaUrl}
                target="_blank"
                rel="noreferrer"
              >
                {post.fileName}
              </a>
            </div>
          )}

        {/* Content */}
        <div
          className="reader-content"
          dangerouslySetInnerHTML={{
            __html: post.articleHtml || post.caption,
          }}
        />
      </div>
    </>
  );
}

export default ReadPost;
