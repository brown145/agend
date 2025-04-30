"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { MeetingList } from "./MeetingList";
import { StoreUser } from "./useStoreUserEffect";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <div>login required</div>
      </Unauthenticated>
      <Authenticated>
        <div className="px-2">
          <StoreUser />
          <MeetingList />
        </div>
      </Authenticated>
    </>
  );
}
