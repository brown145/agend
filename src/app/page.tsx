"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { TaskList } from "./TaskList";

export default function Home() {
  return (
    <>
      <Unauthenticated>
        <div>login required</div>
      </Unauthenticated>
      <Authenticated>
        <TaskList />
      </Authenticated>
    </>
  );
}
