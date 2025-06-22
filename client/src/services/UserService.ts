import User, { UserFilters } from "@/models/User";
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
    body?: any
  ): Promise<[APIResponse<T>, Headers | null]> {
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");

    const url = `${this.BASE_URL}${this.PATH || ""}${path || ""}${
      params ? "?" + params : ""
    }`;

    Logger.info(url);

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
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
      console.log(err);
      return [{ hasError: true, error: "unknown_error" }, null];
    }
  }

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

    const [res, headers] = await this.doFetch<User[]>(
      "GET",
      "",
      params.toString()
    );

    if (res.hasError) {
      return {
        hasError: true,
        error: res.error,
      };
    }

    const users: User[] = res.data;
    const total = Number(headers?.get("X-Total-Count") ?? 0);

    return {
      hasError: false,
      data: { users: users, total },
    };
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

  public static async getById(id: string): Promise<APIResponse<User>> {
    const res = await this.list({ id, page: 1, pageSize: 1 });

    if (res.hasError) return { hasError: true, error: "api_error" };

    const data = res.data;

    const user = data.users.find((u) => u.id == id);

    if (!user) {
      return {
        hasError: true,
        error: "user_not_found",
      };
    }
    return {
      hasError: false,
      data: user,
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
      data: user,
    };
  }

  public static async update(id: string, user: User): Promise<APIResponse<User>> {
    const [res] = await this.doFetch<User>(
      "PATCH",
      `/${id}`,
      "sector=4000",
      user
    );

    return res;
  }
}
