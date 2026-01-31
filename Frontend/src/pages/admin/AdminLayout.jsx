import React from "react";
import { Container, Nav } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h4 className="admin-logo">🛡️ Admin</h4>

        <Nav className="flex-column gap-2">
          <Nav.Link as={Link} to="/admin/dashboard">
            Dashboard
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/users">
            Users
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/posts">
            Posts
          </Nav.Link>

          <Nav.Link as={Link} to="/admin/reports">
            Reported Content
          </Nav.Link>
          
        </Nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

export default AdminLayout;
