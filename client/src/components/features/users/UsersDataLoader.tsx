import UserService from "@/services/UserService.server";
import React from "react";
import UserListComponent from "./list/UserListComponent";
import Alert from "@/components/common/Alert";
import { UserListProvider } from "@/context/UserListContext";

interface Props {
  filters: {
    page: number;
    pageSize: number;
    searchTerm?: string;
  };
}

/*** (Server Component) carga los usuarios e inicializa el contexto, para que en el primer render se muestre la lista correctamente */
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
