import { CACHE_TAGS } from "@/constants/cache-tags";
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

  private static buildFilterParams(filters: UserFilters) {
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
    if (filters.status) {
      params.set("estado", filters.status);
    }
    return params;
  }

  public static async list(
    filters: UserFilters
  ): Promise<APIResponse<{ users: User[]; total: number }>> {
    const params = this.buildFilterParams(filters);
    const res = await fetch(
      `${this.BASE_URL}${this.PATH}?${params.toString()}`,
      {
        method: "GET",
        next: { tags: [CACHE_TAGS.users] },
      }
    );

    if (!res.ok) {
      return {
        hasError: true,
        error: "api_error",
      };
    }

    const users: User[] = await res.json();
    const total = Number(res.headers?.get("X-Total-Count") ?? 0);

    return {
      hasError: false,
      data: { users: users, total },
    };
  }

  public static async create(user: User): Promise<APIResponse<User>> {
    const res = await fetch(`${this.BASE_URL}${this.PATH}?sector=4000`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      return {
        hasError: true,
        error: "api_error",
      };
    }

    const newUser: User = await res.json();
    return { hasError: false, data: newUser };
  }

  public static async update(
    id: string,
    user: User
  ): Promise<APIResponse<User>> {
    const res = await fetch(`${this.BASE_URL}${this.PATH}/${id}?sector=4000`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      return {
        hasError: true,
        error: "api_error",
      };
    }

    const updatedUser: User = await res.json();
    return { hasError: false, data: updatedUser };
  }

  public static async delete(id: string): Promise<APIResponse<boolean>> {
    const res = await fetch(`${this.BASE_URL}${this.PATH}/${id}?sector=4000`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        hasError: true,
        error: "api_error",
      };
    }

    return { hasError: false, data: true };
  }
}
