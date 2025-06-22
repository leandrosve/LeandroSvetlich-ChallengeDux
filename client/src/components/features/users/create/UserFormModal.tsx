"use client";
import User from "@/models/User";
import { useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import UserForm from "./UserForm";
import { useUserList } from "@/context/UserListContext";
import UserService from "@/services/UserService";
import { ProgressSpinner } from "primereact/progressspinner";
import useUserToEdit from "@/hooks/useUserToEdit";
import Alert from "@/components/common/Alert";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

type Mode = "create" | "edit" ;

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

  const [open, mode, userId] = useMemo(
    () => parseModalParams(searchParams),
    [searchParams]
  );

  const { user, loading, error, reset } = useUserToEdit(userId);

  const toast = useRef<Toast>(null);

  const onHide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user");
    window.history.replaceState(null, "", `?${params.toString()}`);
    reset();
  }, [searchParams]);

  const onSuccess = useCallback(
    (action: "edit" | "create") => {
      onHide();
      toast.current?.show({
        severity: "success",
        summary: action == "edit" ? "Editar Usuario" : "Nuevo Usuario",
        detail: `El usuario se ha ${
          mode == "edit" ? "editado" : "creado"
        } correctamente!`,
        life: 3000,
      });
    },
    [toast]
  );

  return (
    <>
      <Toast ref={toast} />
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
    </>
  );
};

export default UserFormModal;
