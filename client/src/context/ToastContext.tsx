"use client";

import React, { createContext, useContext, useState } from "react";

/* Contexto de las Toast notifications, debe ser externo al UserList para que las notificaciones no desaparezcan al navegar o recargar la lista  */
interface ToastOptions {
  title?: string;
  description?: string;
  severity?: "success" | "error" | "info";
  duration: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  toastContent: ToastOptions | null;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastContent, setToastContent] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToastContent(options);
  };

  return (
    <ToastContext.Provider value={{ showToast, toastContent }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
};
