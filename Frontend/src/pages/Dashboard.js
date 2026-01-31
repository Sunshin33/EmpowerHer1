import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { restorePost } from "../services/PostService";
import { FaBook, FaPenFancy, FaHome, FaUsers } from "react-icons/fa";
import API from "../api";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archivedPosts, setArchivedPosts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [journalsRes, postsRes, archivedRes] = await Promise.all([
          API.get("/journals"),
          API.get("/posts/mine"),
          API.get("/posts/mine/archived"),
        ]);

        setJournals(journalsRes.data);
        setPosts(postsRes.data);
        setArchivedPosts(archivedRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  const handleRestore = async (postId) => {
  await restorePost(postId);

  // Move post from archived → active
  const restored = archivedPosts.find(p => p._id === postId);

  setArchivedPosts(prev => prev.filter(p => p._id !== postId));
  setPosts(prev => [restored, ...prev]);
};

  const stripHtml = (html = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};


  return (
    <div className="dashboard-page">
      <Container className="py-5">

        {/* ===== HERO HEADER CARD ===== */}
        <Card className="p-4 shadow-sm mb-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="fw-bold mb-1" style={{ color: "#ff1493" }}>
                Welcome back{user?.fullName ? `, ${user.fullName}` : ""} 💗
              </h3>
              <p className="text-muted mb-0">
                Your safe space. Your healing journey. One step at a time.
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Badge bg="light" text="dark" className="px-3 py-2">
                ✨ You’re doing great
              </Badge>
            </Col>
          </Row>
        </Card>

        {/* ===== STATS ===== */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="p-4 shadow-sm text-center">
              <FaBook size={28} className="mb-2" style={{ color: "#ff1493" }} />
              <h6 className="text-muted">Journal Entries</h6>
              <h2 className="fw-bold" style={{ color: "#ff1493" }}>
                {journals.length}
              </h2>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-4 shadow-sm text-center">
              <FaPenFancy size={28} className="mb-2" style={{ color: "#ff1493" }} />
              <h6 className="text-muted">Your Posts</h6>
              <h2 className="fw-bold" style={{ color: "#ff1493" }}>
                {posts.length}
              </h2>
            </Card>
          </Col>
        </Row>

        {/* ===== RECENT ACTIVITY ===== */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3" style={{ color: "#ff1493" }}>
                📝 Recent Journals
              </h5>

              {journals.slice(0, 3).map((j) => (
                <div key={j._id} className="border-bottom py-3 recent-post-item">
                  <strong>{j.title}</strong>
                  <br />
                  <small className="text-muted">
                    {new Date(j.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}

              {journals.length === 0 && (
                <p className="text-muted mt-3 fst-italic text-center">
                  Start journaling to see entries here ✨
                </p>
              )}
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3" style={{ color: "#ff1493" }}>
                💬 Recent Posts
              </h5>

              {posts.slice(0, 3).map((p) => (
  <div key={p._id} className="recent-post-card">
    
    <div className="d-flex justify-content-between align-items-start mb-1">
      <strong className="recent-post-title">
        {p.title}
      </strong>
      <small className="text-muted">
        {new Date(p.createdAt).toLocaleDateString()}
      </small>
    </div>

    <p className="recent-post-preview">
      {stripHtml(p.caption || "").substring(0, 120)}
      {stripHtml(p.caption || "").length > 120 && "…"}
    </p>

    <div className="recent-post-reactions">
      <span>👍 {p.reactions?.like || 0}</span>
      <span>❤️ {p.reactions?.love || 0}</span>
      <span>😢 {p.reactions?.sad || 0}</span>
    </div>

  </div>
))}


              {posts.length === 0 && (
                <p className="text-muted mt-3 fst-italic text-center">
                  You haven’t shared anything yet 💗
                </p>
              )}
            </Card>
          </Col>
        </Row>
        
{/* ===== ARCHIVED POSTS ===== */}
<Row className="g-4 mb-4">
  <Col md={12}>
    <Card className="p-4 shadow-sm">
      <h5 className="fw-bold mb-3" style={{ color: "#ff1493" }}>
        📦 Archived Posts
      </h5>

      {archivedPosts.map((p) => (
        <div key={p._id} className="recent-post-card d-flex justify-content-between align-items-start">
          <div>
            <strong>{p.title || "Untitled Post"}</strong>
            <br />
            <small className="text-muted">
              Archived • {new Date(p.updatedAt).toLocaleDateString()}
            </small>
          </div>

          <Button className="btn-arch"
            size="sm"
            onClick={() => handleRestore(p._id)}
          >
            Restore
          </Button>
        </div>
      ))}

      {archivedPosts.length === 0 && (
        <p className="text-muted fst-italic text-center">
          No archived posts 📭
        </p>
      )}
    </Card>
  </Col>
</Row>


        {/* ===== QUICK ACTIONS ===== */}
        <Card className="p-4 shadow-sm mt-4">
          <h5 className="fw-bold mb-4 text-center" style={{ color: "#ff1493" }}>
            ⚡ Quick Actions
          </h5>

          <Row className="g-3">
            <Col md={6}>
              <Button
                className="btn-pink w-100"
                onClick={() => navigate("/")}
              >
                <FaHome className="me-2" />
                Go to Home
              </Button>
            </Col>

            <Col md={6}>
              <Button
                className="btn-pink w-100"
                onClick={() => navigate("/community")}
              >
                <FaUsers className="me-2" />
                View Community
              </Button>
            </Col>
          </Row>
        </Card>

      </Container>
    </div>
  );
}

export default Dashboard;
