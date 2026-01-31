import React, { useEffect, useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getMyPosts, deletePost, reactToPost } from "../services/PostService";
import { archivePost } from "../services/PostService";
import "./MyPostsSection.css";

function MyPostsSection() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load my posts", err);
      setPosts([]);
    }
  };

  const handleReact = async (postId, type) => {
    try {
      const updated = await reactToPost(postId, type);
      setPosts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleArchive = async (postId) => {
  if (!window.confirm("Archive this post?")) return;

  try {
    await archivePost(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  } catch (err) {
    console.error("Archive failed", err);
  }
};


  return (
    <div className="my-posts-grid">
      {posts.map((post) => {
        if (!post) return null;

        const hasMedia = !!post.mediaUrl;
        const isImage = post.mediaType?.startsWith("image");
        const isVideo = post.mediaType?.startsWith("video");
        const isFile = hasMedia && !isImage && !isVideo;

        return (
          <Card key={post._id} className="post-card-modern">
            {hasMedia && (
              <div className="post-media-wrapper">
                {isImage && (
                  <img
                    src={post.mediaUrl}
                    alt=""
                    className="post-media-modern"
                    onClick={() => window.open(post.mediaUrl, "_blank")}
                  />
                )}

                {isVideo && (
                  <video
                    src={post.mediaUrl}
                    className="post-media-modern"
                    controls
                  />
                )}

                {isFile && (
                  <div
                    className="file-preview-modern"
                    onClick={() => window.open(post.mediaUrl, "_blank")}
                  >
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <div className="file-name">
                        {post.fileName || "Document"}
                      </div>
                      <div className="file-open-hint">Click to open</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Card.Body className="post-body-modern">
              <div className="post-header-modern">
                <h6 className="post-title-modern clickable-title">
                  {post.title || "Untitled Post"}
                </h6>
                {post.anonymous && (
                  <Badge bg="secondary" className="ms-2">
                    Anonymous
                  </Badge>
                )}
              </div>

              <div
                className="post-caption-modern"
                dangerouslySetInnerHTML={{ __html: post.caption || "" }}
              />

              <div className="post-meta-modern">
                {new Date(post.createdAt).toLocaleString()}
              </div>

              <div className="post-reactions-modern">
                <Button
                  size="sm"
                  className="reaction-button"
                  onClick={() => handleReact(post._id, "like")}
                >
                  👍 {post.reactions?.like || 0}
                </Button>
                <Button
                  size="sm"
                  className="reaction-button"
                  onClick={() => handleReact(post._id, "love")}
                >
                  ❤️ {post.reactions?.love || 0}
                </Button>
                <Button
                  size="sm"
                  className="reaction-button"
                  onClick={() => handleReact(post._id, "sad")}
                >
                  😢 {post.reactions?.sad || 0}
                </Button>
              </div>

              <div className="post-actions-modern">
                <Button
                  size="sm"
                  className="post-action"
                  onClick={() => navigate(`/posts/${post._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="post-action btn-del"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </Button>
                 <Button
    size="sm"
    className="post-action btn-outline-secondary"
    onClick={() => handleArchive(post._id)}
  >
    Archive
  </Button>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}

export default MyPostsSection;
