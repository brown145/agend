"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { useParamIds } from "./_hooks/useParamIds";

export default function MeetingsPage() {
  const { organizationId } = useParamIds();
  const meetings = useQuery(
    api.meetings.list,
    organizationId
      ? {
          orgId: organizationId,
        }
      : "skip",
  );

  return (
    <div className="h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button
          variant="link"
          size="sm"
          className="w-fit text-muted-foreground"
        >
          <Link href={`/${organizationId}/new`}>New meeting</Link>
        </Button>
      </div>
      <div className="flex flex-col">
        {meetings?.map((meeting) => (
          <div key={meeting._id} className="hover:underline">
            <Link href={`/${organizationId}/${meeting._id}`}>
              {meeting.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
