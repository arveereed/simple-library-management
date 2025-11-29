import { type ReactNode } from "react";

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export const CardContent = ({ children, className = "" }: CardContentProps) => {
  return <div className={`${className}`}>{children}</div>;
};
