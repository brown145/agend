import { useMutation } from "convex/react";
import React, { createContext, useContext } from "react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type UserContextType = {
  user: Doc<"users"> | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const ensureUser = useMutation(api.users.ensureUser);
  const [user, setUser] = React.useState<Doc<"users"> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function initializeUser() {
      try {
        const userDoc = await ensureUser();
        setUser(userDoc);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing user:", error);
        setIsLoading(false);
      }
    }

    initializeUser();
  }, [ensureUser]);

  const value = {
    user,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
