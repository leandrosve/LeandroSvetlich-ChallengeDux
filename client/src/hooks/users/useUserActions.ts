import { useRouter, useSearchParams } from "next/navigation";
import { buildUserFilterUrl } from "@/utils/filters";
import { useCallback } from "react";
import { useUserListContext } from "@/context/UserListContext";
import { ROUTES } from "@/constants/routes";
import User from "@/models/User";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/services/UserService.client";
import { useToast } from "@/context/ToastContext";

const useUserActions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { filters, actions } = useUserListContext();

  const { showToast } = useToast();

  const onPageChange: (page: number, pageSize: number) => void = useCallback(
    (page: number, pageSize: number) => {
      const url = buildUserFilterUrl({ ...filters, page: page + 1, pageSize });
      router.replace(url, { scroll: false });
    },
    [filters, router]
  );

  const onSort = useCallback(
    (sort: string, order: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sort);
      params.set("order", order);
      router.replace(`${ROUTES.users}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const onEditUser = useCallback((user: User) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "edit");
    params.set("user", user.id);
    // Evito usar router para no generar un re-render de la pagina
    window.history.pushState(null, "", `?${params.toString()}`);
  }, [searchParams]);

  const onDeleteUser = useCallback(
    async (user: User) => {
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
    },
    [router, showToast]
  );

  const onCreateUser = useCallback(async (data: User) => {
    const res = await createUser(data);
    return res;
  }, []);

  const onUpdateUser = useCallback(
    async (id: string, data: User) => {
      const res = await updateUser(id, data);
      if (!res.hasError) {
        actions.update(id, res.data);
      }
      return res;
    },
    [actions]
  );

  return {
    onDeleteUser,
    onSort,
    onPageChange,
    onEditUser,
    onUpdateUser,
    onCreateUser,
  };
};

export default useUserActions;
