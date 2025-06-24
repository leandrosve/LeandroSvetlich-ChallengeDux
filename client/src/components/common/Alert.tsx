import { Message, MessageProps } from "primereact/message";
import React, { ReactNode } from "react";

interface Props extends MessageProps {
  title?: string;
  description?: string;
  severity?: "success" | "info" | "error";
  children?: ReactNode;
}
const getBorderColor = (severity?: Props["severity"]) => {
  switch (severity) {
    case "success":
      return "var(--green-600)";
    case "info":
      return "var(--blue-600)";
    case "error":
      return "var(--red-600)";
    default:
      return "var(--primary-color)";
  }
};

const getIcon = (severity?: Props["severity"]) => {
  switch (severity) {
    case "success":
      return "pi pi-check-circle";
    case "info":
      return "pi pi-info-circle";
    case "error":
      return "pi pi-exclamation-triangle";
    default:
      return "";
  }
};

const Alert = ({
  title,
  description,
  className,
  severity,
  children,
  ...props
}: Props) => {
  return (
    <Message
      style={{
        borderLeft: `6px solid ${getBorderColor(severity)}`,
      }}
      className={` w-full justify-content-start ${className}`}
      severity={severity}
      {...props}
      content={
        <div className="flex py-3 gap-2 flex-1">
          {severity && <span className={`${getIcon(severity)} text-xl`} />}
          <div className="flex flex-column align-items-start flex-1">
            {title && <div className="ml-2 font-bold">{title}</div>}
            {description && <div className="ml-3 mt-2">{description}</div>}
            {children}
          </div>
        </div>
      }
    />
  );
};

export default Alert;
