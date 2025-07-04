import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import UserService from "@/services/UserService.server";
import { userFormSchema } from "@/validation/userFormSchema";
import User from "@/models/User";
import Logger from "@/utils/Logger";
import { CACHE_TAGS } from "@/constants/cache-tags";

/**
 * Valida el modelo, crea un usuario e invalida el tag
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = userFormSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "invalid_data" }), {
      status: 400,
    });
  }

  const newUser: User = parsed.data;

  const res = await UserService.create(newUser);

  Logger.info("[CREAR-USUARIO]", res);
  if (res.hasError) {
    return new Response(JSON.stringify(res), {
      status: 400,
    });
  }

  revalidateTag(CACHE_TAGS.users);
  return new Response(JSON.stringify(res));
}
