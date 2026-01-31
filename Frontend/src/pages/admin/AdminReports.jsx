import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Spinner, Alert, Button } from "react-bootstrap";
import API from "../../api";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/admin/reports");
      setReports(res.data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  /* ===== ACTIONS ===== */

  const handleRemovePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/admin/posts/${postId}`);
      fetchReports();
    } catch {
      alert("Failed to delete post");
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Ban this user?")) return;
    try {
      await API.put(`/admin/users/${userId}/ban`);
      alert("User banned");
    } catch {
      alert("Failed to ban user");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h3 className="fw-bold mb-4">🚨 Reported Content</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Post</th>
            <th>Reason</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.post?.title || "Untitled"}</td>

              <td>
                <Badge bg="warning" text="dark">
                  {report.reason}
                </Badge>
              </td>

              <td>{report.post?.user?.fullName || "Anonymous"}</td>

              <td>
                <Badge bg="danger">Flagged</Badge>
              </td>

              <td style={{ display: "flex", gap: "8px" }}>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemovePost(report.post?._id)}
                >
                  Delete Post
                </Button>

                <Button
                  size="sm"
                  variant="dark"
                  onClick={() => handleBanUser(report.post?.user?._id)}
                >
                  Ban User
                </Button>
              </td>
            </tr>
          ))}

          {reports.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No reports 🎉
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminReports;
