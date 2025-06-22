"use client";
import User, { UserFilters } from "@/models/User";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableSelectEvent,
  DataTableStateEvent,
} from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useCallback } from "react";

interface Props {
  users: User[];
  onSort: (sortField: keyof User, sortOrder: "asc" | "desc") => void;
  filter: UserFilters;
}

const statusBodyTemplate = (user: User) => {
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

function UserTable({ users, onSort, filter }: Props) {

  const handleSort = useCallback((e: DataTableStateEvent) => {
    onSort(e.sortField as keyof User, e.sortOrder == 1 ? "asc" : "desc");
  }, []);

  const onRowSelect = useCallback((e: DataTableSelectEvent) => {
    const params = new URLSearchParams(window.location.search);
    params.set("modal", "edit");
    params.set("user", e.data.id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, []);
  return (
    <DataTable
      className="min-w-full"
      value={users}
      size="small"
      onRowSelect={onRowSelect}
      selectionMode="single"
      emptyMessage="No se han encontrado resultados"
      onSort={handleSort}
      sortField={filter.sort}
      sortOrder={filter.order == "asc" ? 1 : -1}
      tableStyle={{ minWidth: "100%" }}
    >
      <Column field="id" header="Id" sortable style={{ width: "15%" }}></Column>
      <Column
        field="usuario"
        header="Usuario"
        sortable
        style={{ width: "35%" }}
      ></Column>
      <Column
        field="estado"
        header="Estado"
        sortable
        style={{ width: "25%" }}
        body={statusBodyTemplate}
      ></Column>
      <Column field="sector" header="Sector" style={{ width: "25%" }}></Column>
    </DataTable>
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
