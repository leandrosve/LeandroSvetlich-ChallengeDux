import APIResponse from "@/models/APIResponse";
import User from "@/models/User";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const PATH = "/personal";

// Envuelve a los otros request para atrapar cualquier error inesperado
async function safeFetch<T>(
  fetchFn: () => Promise<Response>
): Promise<APIResponse<T>> {
  try {
    const res = await fetchFn();
    if (!res.ok) {
      return { hasError: true, error: `unknown_error` };
    }
    const data = (await res.json()) as T;
    return { hasError: false, data };
  } catch {
    return { hasError: true, error: "Error inesperado al hacer la solicitud" };
  }
}

export function createUser(user: User): Promise<APIResponse<User>> {
  return safeFetch<User>(() =>
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
  );
}

export function updateUser(
  userId: string,
  user: User
): Promise<APIResponse<User>> {
  return safeFetch<User>(() =>
    fetch("/api/users/" + userId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
  );
}

export async function isUserIdAvailable(
  id: string
): Promise<APIResponse<{ id: string; available: boolean }>> {
  const params = "?id=" + id;
  const res = await fetch(`${BASE_URL}${PATH}${params}`);

  if (!res.ok) return { hasError: true, error: "api_error" };

  const data: User[] = (await res.json()) ?? [];

  const foundUser = !!data.find((u) => u.id == id);
  return {
    hasError: false,
    data: { available: !foundUser, id: id },
  };
}

export async function getById(
  id: string,
  restrictSector: boolean
): Promise<APIResponse<User>> {
  const params = new URLSearchParams({ id: id });

  if (restrictSector) {
    params.set("sector", "4000");
  }

  const res = await fetch(`${BASE_URL}${PATH}?${params.toString()}`);

  if (!res.ok) return { hasError: true, error: "api_error" };

  const data: User[] = (await res.json()) ?? [];

  const user = data.find((u) => u.id == id);

  if (user)
    return {
      hasError: false,
      data: user,
    };

  return { hasError: true, error: "user_not_found" };
}
