"use client";

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
        <RedirectToMeetings />
      </Authenticated>
    </div>
  );
}

function RedirectToMeetings() {
  const router = useRouter();

  useEffect(() => {
    router.push("/meetings");
  }, [router]);

  return <div>redirecting...</div>;
}
