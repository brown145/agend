"use client";

import { NavigationBar } from "@/components/NavigationBar";
import UserInitalizationProvider, {
  UserInitalized,
  UserNotInitalized,
} from "@/convex/UserInitalization";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";

export default function MeetingsLayout({
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
            <div>Loading...</div>
          </UserNotInitalized>
        </UserInitalizationProvider>
      </Authenticated>
      <Unauthenticated>Auth required</Unauthenticated>
    </>
  );
}
