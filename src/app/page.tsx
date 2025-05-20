"use client";

import UserInitalizationProvider, {
  UserInitalized,
  UserNotInitalized,
  useUserInitalization,
} from "@/app/_components/UserInitalization";
import Loader from "@/components/Loader";
import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Unauthenticated>
        {/* This should never happen if root layout is working */}
        <SignIn withSignUp={true} />
      </Unauthenticated>
      <Authenticated>
        <UserInitalizationProvider>
          <UserInitalized>
            <RedirectToOrganization />
          </UserInitalized>
          <UserNotInitalized>
            {/* TODO: fix loading screen */}
            <div className="w-full h-full bg-lime-600">
              <Loader />
            </div>
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

  return <Loader text="redirecting..." />;
}
