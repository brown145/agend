"use client";

import UserInitalizationProvider, {
  UserInitalized,
  UserNotInitalized,
} from "@/app/_components/UserInitalization";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import NavigationBar from "./_components/NavigationBar";

export default function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <UserInitalizationProvider>
          <UserInitalized>
            <NavigationBar />
            <div className="h-full px-4">{children}</div>
          </UserInitalized>
          <UserNotInitalized>
            {/* TODO: fix loading screen */}
            <div className="w-full h-full bg-sky-600">Loading...</div>
          </UserNotInitalized>
        </UserInitalizationProvider>
      </Authenticated>
      <Unauthenticated>Auth required</Unauthenticated>
    </>
  );
}
