"use client";

import User, { UserFilters } from "@/models/User";
import { DEFAULT_USER_FILTERS } from "@/utils/filters";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

/* Contexto del listado de usuarios, utilizado principalmente para evitar prop drilling en el callback luego de modificar un usuario */

interface UserListData {
  users: User[];
  total: number;
}

interface UserListContextProps {
  data: UserListData;
  filters: UserFilters;
  actions: {
    update: (id: string, user: User) => void;
  };
}
interface UserListProviderProps {
  children: ReactNode;
  initialData?: UserListData;
  initialFilters?: UserFilters;
}

const defaultData: UserListData = {
  users: [],
  total: 0,
};

const UserListContext = createContext<UserListContextProps | undefined>(
  undefined
);

export function UserListProvider({
  children,
  initialData = defaultData,
  initialFilters = DEFAULT_USER_FILTERS,
}: UserListProviderProps) {
  const [data, setData] = useState<UserListData>(initialData);
  const [filters] = useState<UserFilters>(initialFilters);

  const update = useCallback(
    (id: string, updatedUser: User) => {
      setData((prev) => ({
        ...prev,
        users: prev.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    },
    [setData]
  );

  const actions = {
    update,
    setData,
  };

  return (
    <UserListContext.Provider value={{ data, actions, filters }}>
      {children}
    </UserListContext.Provider>
  );
}
export const useUserListContext = (): UserListContextProps => {
  const context = useContext(UserListContext);
  if (!context) throw new Error("Debe usarse desde dentro del UserProvider");
  return context;
};
