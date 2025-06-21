"use client";
import UserTable from "./UserTable";
import User from "@/models/User";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { buildUserFilterUrl } from "@/utils/filters";
import dynamic from "next/dynamic";
import { UserListProvider, useUserList } from "@/context/UserListContext";
import UserFormModal from "./create/UserFormModal";

const ClientPaginator = dynamic(
  () => import("@/components/common/ClientPaginator"),
  { ssr: false }
);

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}

function UserListComponent({ filters }: Props) {
  const data = useUserList();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  return (
    <div className="flex-grow-1 flex flex-column">
      <UserTable users={data.data.users} onSort={onSort} filter={filters} />
      <ClientPaginator
        pageSize={filters.pageSize}
        totalCount={data.data.total}
        page={filters.page}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={onPageChange}
      />
      <UserFormModal />
    </div>
  );
}

export default UserListComponent;
