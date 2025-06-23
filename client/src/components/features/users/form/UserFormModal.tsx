"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
import UserForm from "./UserForm";
import { ProgressSpinner } from "primereact/progressspinner";
import useUserToEdit from "@/hooks/useUserToEdit";
import Alert from "@/components/common/Alert";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/context/ToastContext";

/**
 * Modal de creacion/edicion de usuario, es manejado mediante query params
 */
const UserFormModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    userId: string | null;
  }>({ open: false, mode: "create", userId: null });

  // Actualizo el estado del modal de esta forma para evitar flickers al abrir/cerrar
  useEffect(() => {
    const modeParam = searchParams.get("modal");
    const userIdParam = searchParams.get("user");

    if (modeParam === "edit" || modeParam === "create") {
      setModalState({
        open: true,
        mode: modeParam,
        userId: modeParam === "edit" ? userIdParam : null,
      });
      return;
    }
    setModalState((prev) => ({ ...prev, userId:null, open: false }));
  }, [searchParams]);

  const { user, loading, error, reset } = useUserToEdit(modalState.userId);
  const { showToast } = useToast();

  const onHide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user");
    window.history.replaceState(null, "", `?${params.toString()}`);
    reset();
  }, [searchParams, reset]);

  const onSuccess = useCallback(
    (action: "edit" | "create") => {
      showToast({
        severity: "success",
        title: action == "edit" ? "Editar Usuario" : "Nuevo Usuario",
        description: `¡El usuario se ha ${
          action == "edit" ? "editado" : "creado"
        } correctamente!`,
        duration: 30000,
      });

      if (action == "create") {
        router.replace(ROUTES.users, { scroll: false });
      } else {
        onHide();
        return;
      }

      router.refresh();
    },
    [onHide, router, showToast]
  );

  return (
    <Dialog
      header={modalState.mode == "edit" ? "Editar Usuario" : "Nuevo Usuario"}
      headerClassName="bg-blue-600 text-white dialog-header-primary"
      draggable={false}
      visible={modalState.open}
      dismissableMask
      blockScroll={true}
      className="w-screen md:w-30rem"
      onHide={onHide}
    >
      {loading ? (
        <ProgressSpinner className="custom-spinner my-8" />
      ) : error ? (
        <Alert title={error} severity="error" className="my-3" />
      ) : (
        <UserForm
          onCancel={onHide}
          mode={modalState.mode}
          user={user}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
};

export default UserFormModal;
