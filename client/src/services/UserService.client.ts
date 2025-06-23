import APIResponse from "@/models/APIResponse";
import User from "@/models/User";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const PATH = "/personal";

/**
 * Hace un request al route handler encargado de la creacion de un usuario (y refrescar tag)
 */
export async function createUser(user: User): Promise<APIResponse<User>> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (res.ok) {
    return (await res.json()) as APIResponse<User>;
  }

  return { hasError: true, error: "unknown_error" };
}

/**
 * Hace un request al route handler encargado del update de un usuario (y refrescar tag)
 */
export async function updateUser(
  userId: string,
  user: User
): Promise<APIResponse<User>> {
  const res = await fetch("/api/users/" + userId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (res.ok) {
    return (await res.json()) as APIResponse<User>;
  }

  return { hasError: true, error: "unknown_error" };
}


/**
 * Hace un request al route handler encargado de eliminar un usuario (y refrescar tag)
 */
export async function deleteUser(
  userId: string
): Promise<APIResponse<boolean>> {
  const res = await fetch("/api/users/" + userId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    return (await res.json()) as APIResponse<boolean>;
  }

  return { hasError: true, error: "unknown_error" };
}

/**
 * Llama directamente a la API de Dux para verificar si un id esta disponible (no depende del sector)
 */
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

/**
 * Llama directamente a la API de Dux para obtener un usuario (debe pertencer al sector 4000)
 */
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
