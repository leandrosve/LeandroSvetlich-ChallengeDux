"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import React from "react";

const UserCreateButton = () => {
  const searchParams = useSearchParams();

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "create");
    window.history.replaceState(null, '', `?${params.toString()}`)
  };

  return <Button label="Nuevo Usuario" icon="pi pi-plus" className="w-full md:w-auto" onClick={onClick}/>;
};

export default UserCreateButton;
