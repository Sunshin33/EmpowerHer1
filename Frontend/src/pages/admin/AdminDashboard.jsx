import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import API from "../../api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <h3 className="fw-bold mb-4">Admin Dashboard</h3>

      <Row className="g-4">
        <Col md={3}>
          <Card className="p-4 text-center shadow-sm">
            <h6>Total Users</h6>
            <h2>{stats.usersCount}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-4 text-center shadow-sm">
            <h6>Posts Today</h6>
            <h2>{stats.postsToday}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-4 text-center shadow-sm">
            <h6>Anonymous Posts</h6>
            <h2>{stats.anonymousPosts}</h2>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-4 text-center shadow-sm">
            <h6>Flagged Posts</h6>
            <h2>{stats.flaggedPosts}</h2>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AdminDashboard;
