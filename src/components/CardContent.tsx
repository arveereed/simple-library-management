import { type ReactNode } from "react";

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export const CardContent = ({ children, className = "" }: CardContentProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};
