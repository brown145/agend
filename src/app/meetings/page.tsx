"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

export default function MeetingsPage() {
  const meetings = useQuery(api.meetings.list);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button
          variant="link"
          size="sm"
          className="w-fit text-muted-foreground"
        >
          <Link href="/meetings/new">New meeting</Link>
        </Button>
      </div>
      <div className="flex flex-col">
        {meetings?.map((meeting) => (
          <div key={meeting._id} className="hover:underline">
            <Link href={`/meetings/${meeting._id}`}>{meeting.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
