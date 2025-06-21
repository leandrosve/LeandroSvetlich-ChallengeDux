import UserService from "@/services/UserService";
import { userFormSchema } from "@/validation/userFormSchema";
import { useEffect, useState } from "react";

// Hago esto para reutilizar la validacion del id
const idSchema = userFormSchema.shape.id;

const useValidateUserId = (id: string | undefined | null) => {
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Limpio estado anterior
    setIdAvailable(null);

    // Si el ID no pasa la validacion, no hago fetch
    if (!id || !idSchema.safeParse(id).success) return;

    const timer = setTimeout(async () => {
      const res = await UserService.isUserIdAvailable(id);
      if (res.hasError) return;

      if (res.data?.available) {
        setIdAvailable(true);
      } else {
        setIdAvailable(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  return idAvailable;
};

export default useValidateUserId;
