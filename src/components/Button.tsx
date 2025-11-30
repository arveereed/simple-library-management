import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "defaultSidebar"
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export function Button({
  children,
  variant = "default",
  size = "md",
  icon,
  weight = "medium",
  className,
  ...props
}: ButtonProps) {
  const base =
    "rounded-xl flex items-center gap-2 transition active:scale-[0.97]";

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const variants = {
    defaultSidebar:
      "bg-white text-black hover:bg-neutral-800 shadow-sm hover:shadow-md",
    default:
      "bg-black text-white hover:bg-neutral-800 shadow-sm hover:shadow-md",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-400 text-gray-900 hover:bg-gray-100",
    ghost: "text-gray-400 hover:bg-gray-200",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        base,
        weights[weight],
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
