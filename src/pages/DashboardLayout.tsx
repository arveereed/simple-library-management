import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "../components/Sidebar";
import Navbar_ from "../components/Navbar";
import { useRegisterSW } from "virtual:pwa-register/react";
import InstallButton from "../components/InstallButton";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useRegisterSW({ immediate: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar_ onMenuClick={() => setSidebarOpen(true)} />
      <div className="fixed bottom-4 right-4 z-50">
        <InstallButton />
      </div>

      <div className="lg:flex">
        <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
