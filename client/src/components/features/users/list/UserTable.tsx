"use client";
import User, { UserFilters } from "@/models/User";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { Menu } from "primereact/menu";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ConfirmDialog = dynamic(
  () => import("primereact/confirmdialog").then((mod) => mod.ConfirmDialog),
  { ssr: false }
);
interface Props {
  users: User[];
  onSort: (sortField: keyof User, sortOrder: "asc" | "desc") => void;
  onDeleteUser: (user: User) => Promise<void>;
  onEditUser: (user: User) => void;
  filter: UserFilters;
}

const statusTemplate = (user: User) => {
  return <Tag severity={getSeverity(user.estado)}>{user.estado}</Tag>;
};

const getSeverity = (status: string) => {
  switch (status) {
    case "ACTIVO":
      return "info";

    case "INACTIVO":
      return "warning";

    default:
      return "secondary";
  }
};

function UserTable({ users, onSort, onDeleteUser, onEditUser, filter }: Props) {
  const handleSort = useCallback(
    (e: DataTableStateEvent) => {
      onSort(e.sortField as keyof User, e.sortOrder == 1 ? "asc" : "desc");
    },
    [onSort]
  );

  const menu = useRef<Menu>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const actionsTemplate = useCallback(
    (user: User) => {
      return (
        <Button
          icon="pi pi-ellipsis-h"
          className="border-round"
          severity="secondary"
          text
          onClick={(event) => {
            setSelectedUser(user);
            menu.current?.toggle(event);
          }}
        />
      );
    },
    [menu, setSelectedUser]
  );

  const confirmDelete = useCallback(
    (user: User) => {
      confirmDialog({
        message: "¿Estás seguro que deseas eliminar el usuario?",
        header: "Eliminar usuario",
        defaultFocus: "cancel",
        accept: () => onDeleteUser(user),
      });
    },
    [onDeleteUser]
  );

  const actionMenuItems = useMemo(
    () => [
      {
        items: [
          {
            label: "Editar",
            icon: "pi pi-pencil",
            command: () => !!selectedUser && onEditUser(selectedUser),
          },
          {
            label: "Eliminar",
            icon: "pi pi-trash",
            command: () => !!selectedUser && confirmDelete(selectedUser),
          },
        ],
      },
    ],
    [selectedUser, confirmDelete, onEditUser]
  );

  return (
    <>
      <Menu model={actionMenuItems} popup ref={menu} id="popup_action_menu" />
      <ConfirmDialog />
      <DataTable
        className="min-w-full"
        value={users}
        size="small"
        onRowSelect={(e) => onEditUser(e.data)}
        selectionMode="single"
        emptyMessage="No se han encontrado resultados"
        onSort={handleSort}
        sortField={filter.sort}
        sortOrder={filter.order == "asc" ? 1 : -1}
        tableStyle={{ minWidth: "100%" }}
      >
        <Column
          field="id"
          header="Id"
          sortable
          style={{ width: "15%", height:'4rem' }}
        ></Column>
        <Column
          field="usuario"
          header="Usuario"
          sortable
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="estado"
          header="Estado"
          style={{ width: "25%" }}
          body={statusTemplate}
        ></Column>
        <Column
          field="sector"
          header="Sector"
          style={{ width: "20%" }}
        ></Column>
        <Column
          header="Acciones"
          style={{ width: "5%" }}
          body={actionsTemplate}
        ></Column>
      </DataTable>
    </>
  );
}

export const UserTableSkeleton = () => (
  <div className="gap-2 flex flex-column align-items-stretch w-full flex-grow-1 pb-2">
    <Skeleton width="full" height="4rem" />
    <Skeleton width="full" height="25rem" />
    <div className="flex-grow-1"></div>
    <Skeleton
      width="40rem"
      height="3rem"
      className="max-w-full align-self-center"
    />
  </div>
);

export default UserTable;
