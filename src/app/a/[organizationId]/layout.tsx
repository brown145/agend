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
            <div className="h-full flex flex-col">
              <div className="fixed top-0 left-0 right-0 z-10 bg-white">
                <NavigationBar />
              </div>
              <div className="flex-1 flex flex-col">{children}</div>
            </div>
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
