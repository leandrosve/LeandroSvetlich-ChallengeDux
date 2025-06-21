import React, { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  htmlFor: string;
}

export default function Field({ label, htmlFor, children }: Props) {
  return (
    <div className="flex flex-column gap-2">
      <div className="flex gap-1">
        <label htmlFor={htmlFor}>{label}</label>
      </div>

      {children}
    </div>
  );
}
