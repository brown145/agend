"use client";

import Loader from "@/components/Loader";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  UserInitalized,
  UserNotInitalized,
} from "./_components/UserInitalizationProvider";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  console.error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

export default function ClientAuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <UserInitalized>{children}</UserInitalized>
        <UserNotInitalized>
          {/* TODO: fix loading screen */}
          <div className="w-full h-full bg-green-600">
            <Loader />
          </div>
        </UserNotInitalized>
      </Authenticated>
      <Unauthenticated>
        {/* TODO: fix loading screen */}
        <div className="w-full h-full bg-pink-600">
          <Loader />
        </div>
      </Unauthenticated>
    </>
  );
}
