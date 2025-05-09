import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserInitalizationType = {
  isInitialized: boolean;
  personalOrgId: string | null;
};

const UserInitalizationContext = createContext<UserInitalizationType>({
  isInitialized: false,
  personalOrgId: null,
});

export default function UserInitalizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ensureUser = useMutation(api.users.mutations.ensureUser);
  const [isInitialized, setIsInitialized] = useState(false);
  const [personalOrgId, setPersonalOrgId] = useState<string | null>(null);
  useEffect(() => {
    async function initializeUser() {
      try {
        const userDoc = await ensureUser();
        if (userDoc) {
          setIsInitialized(true);
          setPersonalOrgId(userDoc.personalOrgId);
        } else {
          console.error("Error initializing user: user not found");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        setIsInitialized(false);
      }
    }

    initializeUser();
  }, [ensureUser]);

  return (
    <UserInitalizationContext.Provider value={{ isInitialized, personalOrgId }}>
      {children}
    </UserInitalizationContext.Provider>
  );
}

export function useUserInitalization() {
  // TODO: validate provider with invariant
  return useContext(UserInitalizationContext);
}

export function UserInitalized({ children }: { children: ReactNode }) {
  const { isInitialized } = useUserInitalization();
  return isInitialized ? children : null;
}

export function UserNotInitalized({ children }: { children: ReactNode }) {
  const { isInitialized } = useUserInitalization();
  return isInitialized ? null : children;
}
