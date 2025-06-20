import { Message } from "primereact/message";
import React from "react";

interface Props {
  title?: string;
  description?: string;
  severity?: "success" | "info" | "error";
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

const Alert = (props: Props) => {
  return (
    <Message
      style={{
        borderLeft: `6px solid ${getBorderColor(props.severity)}`,
      }}
      className=" w-full justify-content-start"
      severity={props.severity}
      content={<AlertContent {...props} />}
    />
  );
};

const AlertContent = ({ title, description }: Props) => {
  return (
    <div className="flex flex-column align-items-start py-3">
      {title && <div className="ml-2 font-bold">{title}</div>}
      {description && <div className="ml-3 mt-2">{description}</div>}
    </div>
  );
};

export default Alert;
