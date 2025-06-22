import { CACHE_TAGS } from "@/constants/cache-tags";
import User, { UserCreateRequest, UserFilters } from "@/models/User";
import Logger from "@/utils/Logger";

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

  private static async doFetch<T>(
    method: string,
    path: string,
    params?: string,
    body?: any,
    next?: NextFetchRequestConfig
  ): Promise<[APIResponse<T>, Headers | null]> {
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    const url = `${this.BASE_URL}${this.PATH || ""}${path || ""}${
      params ? "?" + params : ""
    }`;

    Logger.info(url, next);

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
        next: next,
      });

      if (!res.ok) {
        const responseBody = (await res.json()) ?? {};
        return [
          {
            status: res.status,
            error: responseBody["error"] ?? "unknown_error",
            hasError: true,
          } as APIErrorResponse<T>,
          res.headers,
        ];
      }
      const responseBody = await res.json();
      return [
        {
          status: res.status,
          data: responseBody as T,
          hasError: false,
        } as APISuccessfulResponse<T>,
        res.headers,
      ];
    } catch (err) {
      return [{ hasError: true, error: "unknown_error" }, null];
    }
  }


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
    return params;
  }

  public static async list(
    filters: UserFilters
  ): Promise<APIResponse<{ users: User[]; total: number }>> {
    const params = this.buildFilterParams(filters);
    const res = await fetch(
      `https://staging.duxsoftware.com.ar/api-test/personal?${params.toString()}`,
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
    const [res] = await this.doFetch<User>("POST", "", "sector=4000", user);

    if (res.hasError) {
      return {
        hasError: true,
        error: "api_error",
      };
    }

    const createdUserId: string = res.data.id;
    Logger.info("Se creo el usuario - ID: " + createdUserId);
    return {
      hasError: false,
      data: { ...user, id: createdUserId },
    };
  }

  public static async update(
    id: string,
    user: User
  ): Promise<APIResponse<User>> {
    const [res] = await this.doFetch<User>(
      "PATCH",
      `/${id}`,
      "sector=4000",
      user
    );

    return res;
  }
}
