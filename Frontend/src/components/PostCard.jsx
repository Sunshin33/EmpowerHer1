import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { deletePost } from "../services/PostService";
import { archivePost, reportPost } from "../services/PostService";
import { useAuth } from "../auth/AuthContext";
import "./PostCard.css";

function PostCard({
  post,
  onDeleted,
  onReact,
  isOwner,
  showAuthor = false
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?._id;
  const captionRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
  if (captionRef.current) {
    const el = captionRef.current;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }

  
}, [post.caption, expanded]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".post-kebab-wrapper")) {
      setShowMenu(false);
    }
  };

  if (showMenu) {
    document.addEventListener("click", handleClickOutside);
  }

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [showMenu]);

  const userReaction =
    post.reactionUsers?.like?.includes(currentUserId)
    ? "like"
    : post.reactionUsers?.love?.includes(currentUserId)
    ? "love"
    : post.reactionUsers?.sad?.includes(currentUserId)
    ? "sad"
    : null;


  if (!post || !post._id) {
    console.warn("PostCard received invalid post:", post);
    return null;
  }

  const handleReaction = (type) => {
  if (!onReact) return;
  onReact(post._id, type);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(post._id);
    onDeleted && onDeleted(post._id);
  };
  const getMediaUrl = () => {
  if (!post.mediaUrl) return null;

  // If backend already sent full URL, use it
  if (post.mediaUrl.startsWith("http")) {
    return post.mediaUrl;
  }

  // Otherwise prefix backend URL
  return `http://localhost:5000/${post.mediaUrl.replace(/\\/g, "/")}`;
};

const openMedia = () => {
  const url = getMediaUrl();
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};


const handleArchive = async () => {
  try {
    await archivePost(post._id);
    setShowMenu(false);
    onDeleted && onDeleted(post._id); // remove from feed
  } catch (err) {
    console.error("Archive failed:", err);
    alert("Failed to archive post.");
  }
};


const handleViewAuthor = () => {
  if (post.user?._id) {
    navigate(`/profile/${post.user._id}`);
  }
  setShowMenu(false);
};


const handleReport = async () => {
  if (!window.confirm("Report this post as inappropriate?")) return;

  try {
    await reportPost(post._id, "Inappropriate content");
    alert("Post reported. Thank you for keeping the community safe.");
    setShowMenu(false);
  } catch (err) {
    console.error("Report failed:", err);
    alert("Failed to report post.");
  }
};

  
  return (
    <Card className="post-card">
      {/* ================= HEADER ================= */}
      <div className="post-header">
        <div className="post-author-block">
          {showAuthor && (
            <>
              {post.anonymous ? (
                <Badge bg="secondary">Anonymous</Badge>
              ) : (
                <div className="post-author-name">
                  {post.user?.fullName}
                </div>
              )}
            </>
          )}

          <div className="post-date">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="post-kebab-wrapper">
  <div
    className="post-kebab"
    onClick={() => setShowMenu(!showMenu)}
  >
    ⋮
  </div>

  {showMenu && (
    <div className="post-kebab-menu">
     {isOwner && !post.archived && (
  <div className="kebab-item" onClick={handleArchive}>
    📦 Archive
  </div>
)}


      {!post.anonymous && (
        <div className="kebab-item" onClick={handleViewAuthor}>
          👤 View Author
        </div>
      )}

      <div className="kebab-item danger" onClick={handleReport}>
        🚩 Report
      </div>
    </div>
  )}
</div>

      </div>


{/* ================= MEDIA ================= */}
{post.mediaUrl && (() => {
  const isImage = post.mediaType?.startsWith("image");
  const isVideo = post.mediaType?.startsWith("video");
  const isFile = !isImage && !isVideo;

  return (
    <div className="post-media mt-3">
      {isImage && (
        <img
          src={getMediaUrl()}
          alt="post media"
          className="post-media-preview"
          onClick={openMedia}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/media-placeholder.png";
          }}
        />
      )}

      {isVideo && (
        <video
          src={getMediaUrl()}
          controls
          className="post-media-preview"
        />
      )}

      {isFile && (
        <div
          className="file-preview-base file-preview-modern"
          onClick={openMedia}
        >
          <div className="file-icon">📄</div>
          <div className="file-info">
            <div className="file-name">
              {post.fileName || "Document"}
            </div>
            <div className="file-open-hint">
              Click to open
            </div>
          </div>
        </div>
      )}
    </div>
  );
})()}


      {/* ================= BODY ================= */}
      <div className="post-body">
        {post.title && (
          <div
            className="post-title"
            onClick={() => {
              if (post.contentType === "article") {
                navigate(`/posts/${post._id}/read`);
              }
            }}
          >
            {post.title}
          </div>
        )}

       <div
  ref={captionRef}
  className={`post-caption ${expanded ? "expanded" : ""}`}
  dangerouslySetInnerHTML={{ __html: post.caption }}
/>


{/* READ MORE TOGGLE */}
{isOverflowing && (
  <div
    className="read-more-toggle"
    onClick={() => setExpanded(!expanded)}
  >
    {expanded ? "Show less" : "Read more"}
  </div>
)}


  {/* ================= REACTIONS ================= */}
<div className="post-reactions-row">
  <Button
    size="sm"
    className="reaction-button"
    active={userReaction === "like"}
    onClick={() => handleReaction("like")}
  >
    👍
  </Button>

  <Button
    size="sm"
    className="reaction-button"
    active={userReaction === "love"}
    onClick={() => handleReaction("love")}
  >
    ❤️
  </Button>

  <Button
    size="sm"
    className="reaction-button"
    active={userReaction === "sad"}
    onClick={() => handleReaction("sad")}
  >
    😢
  </Button>
</div>


{/* ================= ENGAGEMENT COUNTS (BOTTOM RIGHT) ================= */}
<div className="post-engagement">
  <span>👍 {post.reactions?.like || 0}</span>
  <span>❤️ {post.reactions?.love || 0}</span>
  <span>😢 {post.reactions?.sad || 0}</span>
</div>

        {/* ================= OWNER ACTIONS ================= */}
        {isOwner && (
          <div className="post-actions-row">
            <Button
              size="sm"
              className="post-action"
              onClick={() => navigate(`/posts/${post._id}/edit`)}
            >
              Edit
            </Button>

            <Button
              size="sm"
              className="btn-del"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default PostCard;
