import UserService from "@/services/UserService.server";
import React from "react";
import UserListComponent from "./list/UserListComponent";
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
  // Arrojo una excepction, para evitar la posibilidad de cachear cuando hay errores
  if (hasError) throw new Error("error_fetching_users");

  return (
    <UserListProvider initialData={data} initialFilters={filters}>
      <UserListComponent filters={filters} />
    </UserListProvider>
  );
}

export default UsersDataLoader;
