"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const TaskList = () => {
  const tasks = useQuery(api.tasks.get);
  return (
    <main>{tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}</main>
  );
};
