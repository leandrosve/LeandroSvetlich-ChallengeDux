"use client";
import UserTable from "./UserTable";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { buildUserFilterUrl } from "@/utils/filters";
import { useUserList } from "@/context/UserListContext";
import UserFormModal from "../create/UserFormModal";
import { Paginator } from "primereact/paginator";
import User from "@/models/User";
import { deleteUser } from "@/services/UserService.client";
import { useToast } from "@/context/ToastContext";

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}

function UserListComponent({ filters }: Props) {
  const { data } = useUserList();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const onPageChange = useCallback(
    (page: number, pageSize: number) => {
      const path = buildUserFilterUrl({
        ...filters,
        page: page + 1,
        pageSize: pageSize,
      });
      router.replace(path, {
        scroll: false,
      });
    },
    [filters, searchParams]
  );

  const onSort = useCallback((sortField: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", `${sortField}`);
    params.set("order", `${sortOrder}`);
    router.replace(`${ROUTES.users}?${params.toString()}`, { scroll: false });
  }, []);

  const onDeleteUser = async (user: User) => {
    const res = await deleteUser(user.id);
    if (res.hasError) {
      showToast({
        title: "Eliminar Usuario",
        description: "Ocurrió un error al intentar eliminar el usuario",
        severity: "error",
        duration: 3000,
      });
      return;
    }
    showToast({
      title: "Eliminar Usuario",
      description: "El usuario se eliminó correctamente",
      severity: "success",
      duration: 3000,
    });
    router.refresh();
  };

  return (
    <div className="flex-grow-1 flex flex-column">
      <UserTable
        users={data.users}
        onSort={onSort}
        filter={filters}
        onDeleteUser={onDeleteUser}
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
