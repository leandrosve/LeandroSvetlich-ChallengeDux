import { useUserList } from "@/context/UserListContext";
import User from "@/models/User";
import { getById } from "@/services/UserService.client";
import UserService from "@/services/UserService.server";
import { useCallback, useEffect, useState } from "react";

export default function useUserToEdit(userId: string | null) {
  const { data } = useUserList();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setUser(null);
    setLoading(false);
    setError("");
  }, [])

  // Si el usuario esta en el estado local, lo tomo de ahi, si no lo voy a buscar a la API
  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setLoading(true);
      const local = data.users.find((u) => u.id === userId);
      if (local) {
        setUser(local);
        setLoading(false);
        return;
      }

      const res = await getById(userId, true);
      if (res.hasError || !res.data) {
        setError("Lo sentimos, no se pudo encontrar el usuario");
        setLoading(false);
        return;
      }

      setUser(res.data);
      setLoading(false);
    };

    fetch();
  }, [userId, data.users]);

  return { user, loading, error, reset };
}
