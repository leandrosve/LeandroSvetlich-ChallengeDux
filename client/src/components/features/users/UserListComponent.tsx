"use client";
import UserTable from "./UserTable";
import User from "@/models/User";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { buildUserFilterUrl } from "@/utils/filters";
import dynamic from "next/dynamic";
import { UserListProvider, useUserList } from "@/context/UserListContext";
import UserCreateModal from "./create/UserCreateModal";

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
  users: User[];
  totalCount: number;
}

function UserListComponent({ filters, users, totalCount }: Props) {
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
      <UserTable users={users} onSort={onSort} filter={filters} />
      <ClientPaginator
        pageSize={filters.pageSize}
        totalCount={totalCount}
        page={filters.page}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={onPageChange}
      />
      <UserCreateModal/>
    </div>
  );
}

export default UserListComponent;
