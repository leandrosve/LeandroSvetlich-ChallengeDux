import UserService from "@/services/UserService.server";
import { isUserIdAvailable } from "@/services/UserService.client";
import { userFormSchema } from "@/validation/userFormSchema";
import { useEffect, useState } from "react";

// Hago esto para reutilizar la validacion del id
const idSchema = userFormSchema.shape.id;

const useValidateUserId = (
  id: string | undefined | null,
  initialUserId?: string | undefined | null
) => {
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
   
    setLoading(false);

    if (!id || initialUserId && id == initialUserId) {
      setIdAvailable(true);
      return;
    }

    // Limpio estado anterior
    setIdAvailable(null);

    // Si el ID no pasa la validacion, no hago fetch

    if (!id || !idSchema.safeParse(id).success) return;
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await isUserIdAvailable(id);
      setLoading(false);
      if (res.hasError) return;

      if (res.data?.available) {
        setIdAvailable(true);
      } else {
        setIdAvailable(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [id, initialUserId]);

  return { idAvailable, loading };
};

export default useValidateUserId;
