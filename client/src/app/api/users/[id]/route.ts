import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import UserService from "@/services/UserService.server";
import { userFormSchema } from "@/validation/userFormSchema";
import User from "@/models/User";
import Logger from "@/utils/Logger";
import { CACHE_TAGS } from "@/constants/cache-tags";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const parsed = userFormSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "invalid_data" }), {
      status: 400,
    });
  }

  const newUser: User = parsed.data;

  const res = await UserService.update(params.id, newUser);

  Logger.info(newUser, res);
  if (res.hasError) {
    return new Response(JSON.stringify(res), {
      status: 400,
    });
  }

  revalidateTag(CACHE_TAGS.users);
  return new Response(JSON.stringify(res));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await UserService.delete(params.id);

  if (res.hasError)
    return new Response(JSON.stringify(res), {
      status: 400,
    });

  revalidateTag(CACHE_TAGS.users);
  return new Response(JSON.stringify(res));
}
