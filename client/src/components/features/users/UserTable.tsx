"use client";
import User, { UserFilters } from "@/models/User";
import Logger from "@/utils/Logger";
import { Column } from "primereact/column";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";

interface Props {
  users: User[];
  onSort: (sortField: keyof User, sortOrder: "asc" | "desc") => void;
  filter: UserFilters;
}

const statusBodyTemplate = (user: User) => {
  return <Tag value={user.estado} severity={getSeverity(user.estado)}></Tag>;
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
  const handleSort = (e: DataTableStateEvent) => {
    onSort(e.sortField as keyof User, e.sortOrder == 1 ? "asc" : "desc");
  };
  return (
    <DataTable
      className="min-w-full"
      value={users}
      onRowSelect={(r) => Logger.info(r.data)}
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

export default UserTable;
