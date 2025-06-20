import UserService from "@/services/UserService";
import React from "react";
import UserListComponent from "./UserListComponent";
import Alert from "@/components/common/Alert";

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}
async function UsersDataLoader({ filters }: Props) {
  const { hasError, data } = await UserService.list(filters);

  if (hasError) return <Alert  title="Lo sentimos, se ha producido un error" description="No pudimos obtener los usuarios" severity="error"/>;
  return (
    <UserListComponent
      users={data.users}
      filters={filters}
      totalCount={data.total}
    />
  );
}

export default UsersDataLoader;
