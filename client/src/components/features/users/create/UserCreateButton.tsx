"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import React from "react";

const UserCreateButton = () => {
  const searchParams = useSearchParams();

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "create"); // Agregás o reemplazás el param
    //router.push(`?${params.toString()}`);
    window.history.replaceState(null, '', `?${params.toString()}`)
  };

  return <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={onClick}/>;
};

export default UserCreateButton;
