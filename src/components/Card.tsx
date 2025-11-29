import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
