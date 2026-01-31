import UserNavbar from "../components/UserNavbar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
}

export default UserLayout;
