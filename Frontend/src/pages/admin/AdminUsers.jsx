import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import API from "../../api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBan = async (id) => {
    await API.put(`/admin/users/${id}/ban`);
    loadUsers();
  };

  const handleUnban = async (id) => {
    await API.put(`/admin/users/${id}/unban`);
    loadUsers();
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <h3 className="fw-bold mb-4">User Management</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.role === "admin" ? "dark" : "secondary"}>
                  {u.role}
                </Badge>
              </td>

              <td>
                {u.isVerified ? (
                  <Badge bg="success">Verified</Badge>
                ) : (
                  <Badge bg="warning">Unverified</Badge>
                )}
              </td>

              <td>
                {u.isBanned ? (
                  <Badge bg="danger">Banned</Badge>
                ) : (
                  <Badge bg="success">Active</Badge>
                )}
              </td>

              <td>
                {!u.isBanned ? (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleBan(u._id)}
                  >
                    Ban
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => handleUnban(u._id)}
                  >
                    Unban
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default AdminUsers;
