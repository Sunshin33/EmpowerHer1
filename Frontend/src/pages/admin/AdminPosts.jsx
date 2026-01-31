import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import API from "../../api";

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const { data } = await API.get("/admin/posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await API.delete(`/admin/posts/${id}`);
    loadPosts();
  };

  const handlePin = async (id) => {
    await API.put(`/admin/posts/${id}/pin`);
    loadPosts();
  };

  const handleInappropriate = async (id) => {
    await API.put(`/admin/posts/${id}/inappropriate`);
    loadPosts();
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <h3 className="fw-bold mb-4">Post Moderation</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Anonymous</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((p) => (
            <tr key={p._id}>
              <td>{p.title || "(No title)"}</td>
              <td>{p.user?.fullName || "Unknown"}</td>

              <td>
                {p.anonymous ? (
                  <Badge bg="secondary">Yes</Badge>
                ) : (
                  <Badge bg="success">No</Badge>
                )}
              </td>

              <td>{new Date(p.createdAt).toLocaleString()}</td>

              <td>
                {p.isPinned && <Badge bg="info" className="me-1">Pinned</Badge>}
                {p.isInappropriate && (
                  <Badge bg="danger">Flagged</Badge>
                )}
              </td>

              <td className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handlePin(p._id)}
                >
                  {p.isPinned ? "Unpin" : "Pin"}
                </Button>

                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={() => handleInappropriate(p._id)}
                >
                  {p.isInappropriate ? "Unflag" : "Flag"}
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default AdminPosts;
