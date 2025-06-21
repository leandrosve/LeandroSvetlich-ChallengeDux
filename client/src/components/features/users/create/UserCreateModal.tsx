'use client'
import User from "@/models/User";
import { useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, { useCallback, useMemo } from "react";
import UserForm from "./UserForm";

interface Props {
  mode: 'create' | 'update';
  user?: User;
}

const UserCreateModal = () => {
  const searchParams = useSearchParams();

  const open = useMemo(() => {
    return searchParams.get("modal") == "create";
  }, [searchParams]);

  const onHide = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchParams]);
  return (
    <Dialog
      header="Nuevo Usuario"
      headerClassName="bg-blue-600 text-white dialog-header-primary"
      draggable={false}
      visible={open}
      dismissableMask
      blockScroll={true}
      className="w-screen md:w-30rem"
      onHide={onHide}
    >
      <UserForm onCancel={onHide}/>
    </Dialog>
  );
};

export default UserCreateModal;
