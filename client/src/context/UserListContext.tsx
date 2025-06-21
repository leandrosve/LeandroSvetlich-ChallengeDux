'use client';

import User from '@/models/User';
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserListData {
  users: User[];
  totalCount: number;
}

interface UserListContextProps {
  data: UserListData;
  setData: (data: UserListData) => void;
}

interface UserListProviderProps {
  children: ReactNode;
  initialData?: UserListData;
}

const defaultData: UserListData = { users: [], totalCount: 0 };

const UserListContext = createContext<UserListContextProps | undefined>(undefined);

export function UserListProvider({ children, initialData = defaultData }: UserListProviderProps) {
  const [data, setData] = useState<UserListData>(initialData);

  return (
    <UserListContext.Provider value={{ data, setData }}>
      {children}
    </UserListContext.Provider>
  );
}
export const useUserList = (): UserListContextProps => {
  const context = useContext(UserListContext);
  if (!context) throw new Error("Debe usarse desde dentro del provider");
  return context;
};
