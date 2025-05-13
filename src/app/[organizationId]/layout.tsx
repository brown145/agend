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
              <NavigationBar />
              <div className="flex-1 flex flex-col w-4xl mx-auto">
                {children}
              </div>
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
