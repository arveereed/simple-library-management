import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useFirestoreUser } from "../hooks/useFirestoreUser";
import type { FireStoreUserType } from "../types";

type UserContextType = {
  user: FireStoreUserType | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user: clerkUser } = useUser();

  const { data: userData, isLoading } = useFirestoreUser(
    isSignedIn ? clerkUser?.id : undefined
  );

  const [user, setUser] = useState<FireStoreUserType | null>(null);

  // sync React Query → Context
  // CONDITION: checks if the user is empty
  if (userData && user !== userData) {
    setUser(userData);
  }

  return (
    <UserContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within UserProvider");
  return context;
};
