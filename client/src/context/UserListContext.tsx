"use client";

import User from "@/models/User";
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
  actions: {
    updateUser: (id: string, user: User) => void;
  };
}
interface UserListProviderProps {
  children: ReactNode;
  initialData?: UserListData;
}

const defaultData: UserListData = { users: [], total: 0 };

const UserListContext = createContext<UserListContextProps | undefined>(
  undefined
);

export function UserListProvider({
  children,
  initialData = defaultData,
}: UserListProviderProps) {
  const [data, setData] = useState<UserListData>(initialData);

  const updateUser = useCallback(
    (id: string, updatedUser: User) => {
      setData((prev) => ({
        ...prev,
        users: prev.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    },
    [setData]
  );

  const actions = {
    updateUser,
    setData,
  };

  return (
    <UserListContext.Provider value={{ data, actions }}>
      {children}
    </UserListContext.Provider>
  );
}
export const useUserList = (): UserListContextProps => {
  const context = useContext(UserListContext);
  if (!context) throw new Error("Debe usarse desde dentro del UserProvider");
  return context;
};
