import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default function Home() {
  // Por defecto redirigimos a la pagina de usuarios
  redirect(ROUTES.users);
}
