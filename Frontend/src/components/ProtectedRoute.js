import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProfileLoader from "../components/ProfileLoader";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ProfileLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
