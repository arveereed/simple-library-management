import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  icon,
  className,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition active:scale-[0.97]";

  const variants = {
    default: "bg-slate-500 text-white hover:bg-primary/90",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-400 text-gray-900 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-200",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
