"use client";

import Alert from "@/components/common/Alert";
import { Button } from "primereact/button";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

// Solo quiero mostrar los mensajes que manejo yo, para no mostrat por ej: cannot read properties of undefined
const USER_FRIENDLY_ERRORS: Record<string, string> = {
  ["error_fetching_users"]: "No se pudieron obtener los usuarios",
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="p-4">
      <Alert
        title="Lo sentimos, se ha producido un error"
        severity="error"
        description={USER_FRIENDLY_ERRORS[error.message] ?? ""}
      >
        <div className="flex justify-content-center align-self-stretch">
          <Button
            onClick={() => reset()}
            className="mt-4"
            severity="danger"
            icon="pi pi-refresh"
            label="Reintentar"
          />
        </div>
      </Alert>
    </div>
  );
}
