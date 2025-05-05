"use client";

import { NavigationBar } from "@/components/NavigationBar";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { UserProvider } from "../UserProvider";

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <UserProvider>
          <NavigationBar />
          <div className="h-full px-4">{children}</div>
        </UserProvider>
      </Authenticated>
      <Unauthenticated>Auth required</Unauthenticated>
    </>
  );
}
