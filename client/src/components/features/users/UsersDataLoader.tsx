import UserService from "@/services/UserService";
import React from "react";
import UserListComponent from "./UserListComponent";
import Alert from "@/components/common/Alert";
import { UserListProvider } from "@/context/UserListContext";

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}
async function UsersDataLoader({ filters }: Props) {
  const { hasError, data } = await UserService.list(filters);

  if (hasError)
    return (
      <Alert
        title="Lo sentimos, se ha producido un error"
        description="No pudimos obtener los usuarios"
        severity="error"
      />
    );
  return (
    <UserListProvider initialData={data}>
      <UserListComponent filters={filters} />
    </UserListProvider>
  );
}

export default UsersDataLoader;
