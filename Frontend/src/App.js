import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import UserNavbar from "./components/UserNavbar";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ReadPost from "./pages/ReadPost";
import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserSettings from "./pages/UserSettings";
import ResourcesPage from "./pages/ResourcesPage";
import BackToTopLink from "./components/BackToTopLink";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";



/* ================= PUBLIC LAYOUT ================= */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BackToTopLink />
      <Footer />
    </>
  );
}

/* ================= USER LAYOUT ================= */
function UserLayout() {
  return (
    <>
      <UserNavbar />
      <Outlet />
      <BackToTopLink />
    </>
  );
}

function App() {

  return (
    
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/posts" element={<AdminPosts />} />

          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usersettings" element={<UserSettings />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/posts/:id/edit" element={<EditPost />} />
              <Route path="/posts/:id/read" element={<ReadPost />} />
              <Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
  <Route path="posts" element={<AdminPosts />} />
  <Route path="/admin/reports" element={<AdminReports />} />
</Route>
            </Route>
          </Route>
        </Routes>
      </Router>
   
  );
}

export default App; 