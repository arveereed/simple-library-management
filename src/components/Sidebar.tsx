import React from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";
import { BookOpen, Users, LogOut, BarChart3, X } from "lucide-react";
import { Button } from "./Button";

interface SidebarNavProps {
  open: boolean;
  onClose: () => void;
}

export function SidebarNav({ open, onClose }: SidebarNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed cursor-pointer inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-black text-primary-foreground
          flex flex-col transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto lg:min-h-screen
        `}
      >
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-white" />
            <div>
              <h1 className="font-bold text-xl text-white">Library</h1>
              <p className="text-sm opacity-80 text-white">Management System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-white/10 transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 mt-4 p-2">
          <NavLink
            to="/"
            active={isActive("/")}
            icon={<BarChart3 className="w-5 h-5" />}
            label="Dashboard"
            onClick={onClose}
          />

          <NavLink
            to="/books"
            active={isActive("/books")}
            icon={<BookOpen className="w-5 h-5" />}
            label="Books"
            onClick={onClose}
          />

          <NavLink
            to="/students"
            active={isActive("/students")}
            icon={<Users className="w-5 h-5" />}
            label="Students"
            onClick={onClose}
          />

          <NavLink
            to="/transactions"
            active={isActive("/transactions")}
            icon={<LogOut className="w-5 h-5" />}
            label="Transactions"
            onClick={onClose}
          />
        </nav>

        <div className="p-4 border-t border-primary/20 text-xs opacity-80 text-white">
          <p>Library Management System v1.0</p>
        </div>
      </aside>
    </>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function NavLink({ to, active, icon, label, onClick }: NavLinkProps) {
  return (
    <RouterLink to={to} onClick={onClick}>
      <Button
        variant={active ? "defaultSidebar" : "ghost"}
        className={`w-full justify-start gap-2 cursor-pointer mb-2 ${
          active
            ? "bg-primary-foreground text-primary"
            : "text-primary-foreground hover:bg-primary/80"
        }`}
      >
        {icon}
        {label}
      </Button>
    </RouterLink>
  );
}
