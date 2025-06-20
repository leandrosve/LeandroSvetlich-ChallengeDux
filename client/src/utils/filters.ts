import { ROUTES } from "@/constants/routes";
import User, { UserFilters } from "@/models/User";

export function buildUserFilterUrl(filters: UserFilters): string {
  const params = new URLSearchParams();
  if (filters.searchTerm) params.set("search", filters.searchTerm);
  else params.delete("search");
  if (filters.page) params.set("page", filters.page.toString());
  else params.delete("page");
  if (filters.pageSize) params.set("size", filters.pageSize.toString());
  else params.delete("size");
  if (filters.sort) params.set("sort", filters.sort.toString());
  else {
    params.delete("sort");
    params.delete("order");
  }
  if (filters.order) params.set("order", filters.order.toString());
  else params.delete("order");

  return `${ROUTES.users}?${params.toString()}`;
}

export function parseUserFiltersFromParams(
  params: Record<string, string | string[] | undefined>
): UserFilters {
  const page = parseInt(params.page as string) || 1;
  const pageSize = parseInt(params.size as string) || 10;

  const searchTerm =
    typeof params.search === "string" ? params.search : undefined;

  const sort =
    typeof params.sort === "string" ? (params.sort as keyof User) : undefined;

  const order =
    params.order === "asc" || params.order === "desc"
      ? (params.order as "asc" | "desc")
      : undefined;

  return {
    page,
    pageSize,
    searchTerm,
    sort,
    order,
  };
}
