"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import {
  useCallback, useMemo
} from "react";
import UserForm from "./UserForm";
import { ProgressSpinner } from "primereact/progressspinner";
import useUserToEdit from "@/hooks/useUserToEdit";
import Alert from "@/components/common/Alert";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/context/ToastContext";

type Mode = "create" | "edit";

function parseModalParams(
  searchParams: URLSearchParams
): [boolean, Mode, string | null] {
  const mode = searchParams.get("modal") as Mode;
  const isValidMode = mode === "create" || mode === "edit";
  const userId =
    isValidMode && mode === "edit" ? searchParams.get("user") : null;
  return [isValidMode, isValidMode ? mode : "create", userId];
}

const UserFormModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [open, mode, userId] = useMemo(
    () => parseModalParams(searchParams),
    [searchParams]
  );

  const { user, loading, error, reset } = useUserToEdit(userId);

  const { showToast } = useToast();

  const onHide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user");
    window.history.replaceState(null, "", `?${params.toString()}`);
    reset();
  }, [searchParams]);

  const onSuccess = useCallback((action: "edit" | "create") => {
    showToast({
      severity: "success",
      title: action == "edit" ? "Editar Usuario" : "Nuevo Usuario",
      description: `¡El usuario se ha ${
        action == "edit" ? "editado" : "creado"
      } correctamente!`,
      duration: 30000,
    });
    router.replace(ROUTES.users, {scroll: false});
  }, []);

  return (
    <Dialog
      header={mode == "edit" ? "Editar Usuario" : "Nuevo Usuario"}
      headerClassName="bg-blue-600 text-white dialog-header-primary"
      draggable={false}
      visible={open}
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
          mode={mode}
          user={user}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
};

export default UserFormModal;
