"use client";

import UserInitalizationProvider, {
  UserInitalized,
  UserNotInitalized,
  useUserInitalization,
} from "@/convex/UserInitalization";
import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <UserInitalizationProvider>
          <UserInitalized>
            <RedirectToOrganization />
          </UserInitalized>
          <UserNotInitalized>
            <div>Loading...</div>
          </UserNotInitalized>
        </UserInitalizationProvider>
      </Authenticated>
    </div>
  );
}

function RedirectToOrganization() {
  const router = useRouter();
  const { personalOrgId } = useUserInitalization();

  useEffect(() => {
    if (personalOrgId) {
      router.push(`/${personalOrgId}`);
    }
  }, [router, personalOrgId]);

  return <div>redirecting...</div>;
}
