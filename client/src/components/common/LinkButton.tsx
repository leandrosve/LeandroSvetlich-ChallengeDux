"use client";

import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";

interface LinkButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  href,
  icon,
  children,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`p-button p-component font-bold ${className}`}
      {...props}
    >
      <div className="flex gap-2 align-items-center">
        {icon && <span className={`pi ${icon}`} />}
        {children}
      </div>
    </Link>
  );
}
