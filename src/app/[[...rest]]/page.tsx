"use client";

import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { UserProvider } from "../UserProvider";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <UserProvider>
          <RedirectToOrganization />
        </UserProvider>
      </Authenticated>
    </div>
  );
}

function RedirectToOrganization() {
  const router = useRouter();
  const firstOrganization = useQuery(api.organizations.getUsersFirst);

  console.log(firstOrganization);

  useEffect(() => {
    router.push(`/${firstOrganization?._id}`);
  }, [router, firstOrganization]);

  return <div>redirecting...</div>;
}
