"use client";

import User from "@/models/User";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserListData {
  users: User[];
  total: number;
}

interface UserListContextProps {
  data: UserListData;
  actions: {
    addUser: (user: User) => void;
    updateUser: (id: string, user: User) => void;
    deleteUser: (id: string) => void;
    setData: (data: UserListData) => void;
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

  const updateUser = (id: string, updatedUser: User) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === id ? updatedUser : user)),
    }));
  };

  const deleteUser = (id: string) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== id),
      totalCount: prev.total - 1,
    }));
  };

  const addUser = (user: User) => {
    setData((prev) => {
      const updatedUsers = [user, ...prev.users];

      // Si ya hay el máximo de usuarios mostrados, quitamos el último
      if (updatedUsers.length > prev.users.length) {
        updatedUsers.pop();
      }

      return {
        ...prev,
        users: updatedUsers,
        totalCount: prev.total + 1,
      };
    });
  };

  const actions = {
    addUser,
    updateUser,
    deleteUser,
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
