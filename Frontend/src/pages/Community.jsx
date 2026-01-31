import React, { useEffect, useState } from "react";
import "./Community.css";
import { getPosts, reactToPost } from "../services/PostService";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";

function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD POSTS FROM API ================= */
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load community posts", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  /* ================= HANDLE REACTIONS ================= */
  const handleReact = async (postId, type) => {
    try {
      const updated = await reactToPost(postId, type);
      setPosts(
        posts.map((p) => (p._id === updated._id ? updated : p))
      );
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  return (
    <div className="community-page">
      
  {loading && (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ))}
  </>
)}



      <div className="community-feed">
        {!loading && posts.length === 0 && (
          <p className="empty-text">
            No posts yet. Be the first to share.
          </p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            isOwner={false}
            onReact={handleReact}
            showAuthor
          />
        ))}
      </div>
    </div>
  );
}

export default Community;
