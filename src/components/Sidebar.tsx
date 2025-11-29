import React from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";

import { BookOpen, Users, LogOut, BarChart3 } from "lucide-react";
import { Button } from "./Button";

export function SidebarNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col min-h-screen">
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg">Library</h1>
              <p className="text-xs opacity-80">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-4 p-2 ">
          <NavLink
            to="/"
            active={isActive("/")}
            icon={<BarChart3 className="w-5 h-5" />}
            label="Dashboard"
          />

          <NavLink
            to="/books"
            active={isActive("/books")}
            icon={<BookOpen className="w-5 h-5" />}
            label="Books"
          />

          <NavLink
            to="/students"
            active={isActive("/students")}
            icon={<Users className="w-5 h-5" />}
            label="Students"
          />

          <NavLink
            to="/transactions"
            active={isActive("/transactions")}
            icon={<LogOut className="w-5 h-5" />}
            label="Transactions"
          />
        </nav>

        <div className="p-4 border-t border-primary/20 text-xs opacity-80">
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
}

function NavLink({ to, active, icon, label }: NavLinkProps) {
  return (
    <RouterLink to={to}>
      <Button
        variant={active ? "default" : "ghost"}
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
