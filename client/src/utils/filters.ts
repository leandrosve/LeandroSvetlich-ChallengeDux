import { ROUTES } from "@/constants/routes";
import User, { UserFilters } from "@/models/User";

/* Contiene la para serializar y deserializar de filtros y paginacion del listado de usuarios */
export const DEFAULT_USER_FILTERS: UserFilters = {
  searchTerm: undefined,
  status: undefined,
  page: 1,
  pageSize: 10,
  sort: "id",
  order: "desc",
};

const FILTER_KEYS: {
  [K in keyof UserFilters]?: string;
} = {
  searchTerm: "search",
  status: "status",
  page: "page",
  pageSize: "size",
  sort: "sort",
  order: "order",
};

export function buildUserFilterUrl(filters: UserFilters): string {
  const params = new URLSearchParams(window.location.search);

  for (const key in FILTER_KEYS) {
    const queryKey = FILTER_KEYS[key as keyof UserFilters]!;
    const value = filters[key as keyof UserFilters];
    const defaultValue = DEFAULT_USER_FILTERS[key as keyof UserFilters];

    if (value !== undefined && value !== defaultValue) {
      params.set(queryKey, String(value).toLowerCase());
    } else {
      params.delete(queryKey);
    }
  }

  // Si no hay sort, quitamos el order tambien
  if (!filters.sort || filters.sort === DEFAULT_USER_FILTERS.sort) {
    params.delete("order");
  }

  return `${ROUTES.users}?${params.toString()}`;
}

export function parseUserFiltersFromParams(
  params: Record<string, string | string[] | undefined>
): UserFilters {
  const page = parseInt(params.page as string) || 1;
  let pageSize = parseInt(params.size as string) || 10;
  if (![10, 20, 30].includes(pageSize)) {
    pageSize = 10;
  }
  const searchTerm =
    typeof params.search === "string" ? params.search : undefined;

  const sort =
    typeof params.sort === "string" ? (params.sort as keyof User) : "id";

  let status = undefined;
  if (typeof params.status === "string") {
    if (["ACTIVO", "INACTIVO"].includes(params.status.toUpperCase())) {
      status = params.status.toUpperCase();
    }
  }

  const order =
    params.order === "asc" || params.order === "desc"
      ? (params.order as "asc" | "desc")
      : "desc";

  return {
    page,
    pageSize,
    searchTerm,
    sort,
    order,
    status,
  };
}
