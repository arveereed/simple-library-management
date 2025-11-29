import { Outlet } from "react-router-dom";
import { SidebarNav } from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <div className="flex h-screen bg-background">
        <div>
          <SidebarNav />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
