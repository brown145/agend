"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { StoreUser } from "../useStoreUserEffect";

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <StoreUser />
        <div className="px-4">{children}</div>
      </Authenticated>
      <Unauthenticated>Auth required</Unauthenticated>
    </>
  );
}
