"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { DiscussionList } from "./DiscussionList";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <div>login required</div>
      </Unauthenticated>
      <Authenticated>
        <div className="px-2">
          <DiscussionList />
        </div>
      </Authenticated>
    </>
  );
}
