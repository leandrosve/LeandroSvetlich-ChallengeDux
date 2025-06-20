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

interface UserSearchRequest {
  searchTerm?: string;
  page: number;
  pageSize: number;
  sortBy?: "usuario" | "id" | "sector" | "estado";
  order?: "ASC" | "DESC";
}

const mock = [
  {
    id: "933931",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "STAR OVER SRL",
  },
  {
    id: "933932",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "ADMINGSC",
  },
  {
    id: "933933",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "AS",
  },
  {
    id: "933934",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "OLIVETI",
  },
  {
    id: "933935",
    estado: "INACTIVO",
    sector: 4000,
    usuario: "GOMEZ",
  },
  {
    id: "933936",
    estado: "INACTIVO",
    sector: 4000,
    usuario: "REINA",
  },
  {
    id: "933937",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "ADMINCHELA",
  },
  {
    id: "933938",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "CENTURION",
  },
  {
    id: "933939",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "CUERVA",
  },
  {
    id: "933940",
    estado: "ACTIVO",
    sector: 4000,
    usuario: "DIAZ",
  },
];

export default class UserService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  private static readonly PATH = "/personal";

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  public static async listMock(
    req: UserSearchRequest
  ): Promise<APIResponse<{ users: User[]; total: number }>> {
    await this.sleep(2000);
    return {
      hasError: false,
      data: {
        total: 100,
        users: req.searchTerm
          ? mock.filter((u) =>
              u.usuario
                .toLowerCase()
                .includes(req.searchTerm?.toLowerCase() ?? "")
            )
          : mock,
      },
    };
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
}
