"use client";
import UserTable from "./UserTable";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { buildUserFilterUrl } from "@/utils/filters";
import { useUserList } from "@/context/UserListContext";
import { Paginator } from "primereact/paginator";
import User from "@/models/User";
import { deleteUser } from "@/services/UserService.client";
import { useToast } from "@/context/ToastContext";
import dynamic from "next/dynamic";

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
    [filters, router]
  );

  const onSort = useCallback((sortField: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", `${sortField}`);
    params.set("order", `${sortOrder}`);
    router.replace(`${ROUTES.users}?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const onEditUser = useCallback((user: User) => {
    const params = new URLSearchParams(window.location.search);
    params.set("modal", "edit");
    params.set("user", user.id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, []);

  const onDeleteUser = useCallback(async (user: User) => {
    const res = await deleteUser(user.id);

    showToast({
      title: "Eliminar Usuario",
      description: res.hasError
        ? "Ocurrió un error al intentar eliminar el usuario"
        : "El usuario se eliminó correctamente",
      severity: res.hasError ? "error" : "success",
      duration: 3000,
    });

    router.refresh();
  }, [router, showToast]);

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
