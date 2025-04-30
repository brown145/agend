"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { TopicList } from "./TopicList";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <div>login required</div>
      </Unauthenticated>
      <Authenticated>
        <TopicList />
      </Authenticated>
    </>
  );
}
