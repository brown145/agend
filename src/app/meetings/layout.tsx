"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { StoreUser } from "../useStoreUserEffect";
import { MeetingList } from "./_components/MeetingList";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
        <StoreUser />
        <div className="flex gap-1">
          <div className="w-[200px]">
            <MeetingList />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </Authenticated>
      <Unauthenticated>Auth required</Unauthenticated>
    </>
  );
}
