"use client";

import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { ToastMessage } from "primereact/toast";
import { useToast } from "@/context/ToastContext"; // Ajustá la ruta según tu proyecto

/**
 * Toast de notificaciones, consume el contexto ToastContext
 * Esta hecho de esta manera para que la notificacion perdure aunque se navege a otra ruta
 */
const ToastNotification = () => {
  const toastRef = useRef<Toast>(null);
  const { toastContent } = useToast();

  useEffect(() => {
    if (toastContent && toastRef.current) {
      const message: ToastMessage = {
        severity: toastContent.severity || "info",
        summary: toastContent.title,
        detail: toastContent.description,
        life: 3000,
      };
      toastRef.current.show(message);
    }
  }, [toastContent]);

  return <Toast ref={toastRef} />;
};

export default ToastNotification;
