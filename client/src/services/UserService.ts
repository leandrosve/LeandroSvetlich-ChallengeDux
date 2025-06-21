import User, { UserFilters } from "@/models/User";

type APISuccessfulResponse<T> = {
  data: T;
  hasError: false;
};

type APIErrorResponse<T> = {
  data?: T;
  error: string;
  hasError: true;
};

export type APIResponse<T> = APIErrorResponse<T> | APISuccessfulResponse<T>;

export default class UserService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  private static readonly PATH = "/personal";

  public static async list(
    filters: UserFilters
  ): Promise<APIResponse<{ users: User[]; total: number }>> {
    const params = new URLSearchParams({
      sector: "4000",
      _page: filters.page.toString(),
      _limit: filters.pageSize.toString(),
    });

    if (filters.sort) {
      params.set("_sort", filters.sort);
      params.set("_order", filters.order ?? "asc");
    }

    if (filters.searchTerm) {
      params.set("usuario_like", filters.searchTerm);
    }

    if (filters.id) {
      params.set("id", filters.id);
    }
    const url = `${this.BASE_URL}${this.PATH}?${params.toString()}`;
    console.log(url);
    try {
      const res = await fetch(url);

      if (res.status != 200) {
        return {
          hasError: true,
          error: "unknown_error",
        };
      }
      const users: User[] = await res.json();
      const total = Number(res.headers.get("X-Total-Count") ?? 0);

      return {
        hasError: false,
        data: { users: users, total },
      };
    } catch {
      return {
        hasError: true,
        error: "unknown_error",
      };
    }
  }

  public static async isUserIdAvailable(
    id: string
  ): Promise<APIResponse<{ id: string; available: boolean }>> {
    const res = await this.list({ id, page: 1, pageSize: 1 });
    if (res.hasError) return { hasError: true, error: "api_error" };

    const data = res.data;

    return {
      hasError: false,
      data: { available: !data.users.find((u) => u.id == id), id: id },
    };
  }
}
