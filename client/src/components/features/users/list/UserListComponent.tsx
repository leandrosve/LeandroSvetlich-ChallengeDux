"use client";
import UserTable from "./UserTable";
import { useUserListContext } from "@/context/UserListContext";
import { Paginator } from "primereact/paginator";
import dynamic from "next/dynamic";
import useUserActions from "@/hooks/users/useUserActions";

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}

const UserFormModal = dynamic(() => import("../form/UserFormModal"), {
  ssr: false,
});

function UserListComponent({ filters }: Props) {
  const { data } = useUserListContext();
  const { onPageChange, onEditUser, onDeleteUser, onSort } = useUserActions();

  return (
    <div className="flex-grow-1 flex flex-column">
      <UserTable
        users={data.users}
        onSort={onSort}
        filter={filters}
        onDeleteUser={onDeleteUser}
        onEditUser={onEditUser}
      />
      <div className="flex justify-content-center mt-auto">
        <Paginator
          first={(filters.page - 1) * filters.pageSize}
          rows={filters.pageSize}
          totalRecords={data.total}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={(e) => onPageChange(e.page, e.rows)}
        />
      </div>
      <UserFormModal />
    </div>
  );
}

export default UserListComponent;
