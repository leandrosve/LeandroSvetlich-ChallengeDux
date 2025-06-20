"use client";
import { Paginator } from "primereact/paginator";
import UserTable from "./UserTable";
import User from "@/models/User";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { buildUserFilterUrl } from "@/utils/filters";

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
  const [dynamicUsers, setDynamicUsers] = useState(users);
  const searchParams = useSearchParams();
  const router = useRouter();

  const onPageChange = useCallback(
    (page: number) => {
      const path = buildUserFilterUrl({ ...filters, page: page + 1 });
      router.replace(path, {
        scroll: false,
      });
    },
    [filters]
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
      <Paginator
        className="mt-auto"
        first={(filters.page - 1) * filters.pageSize}
        rows={filters.pageSize}
        totalRecords={totalCount}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={(e) => onPageChange(e.page)}
      />
    </div>
  );
}

export default UserListComponent;
