"use client";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditMeeting } from "./EditMeeting";

export function MeetingHeader({
  orgId,
  meetingId,
}: {
  orgId: string;
  meetingId: string;
}) {
  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = searchParams.get("edit") === "true";

  const setEditMode = (edit: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (edit) {
      params.set("edit", "true");
    } else {
      params.delete("edit");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <EditMeeting
          orgId={orgId}
          meetingId={meetingId}
          onCancel={() => setEditMode(false)}
        />
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Attendees</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-6xl font-medium" onClick={() => setEditMode(true)}>
        {meetingDetails?.title}
      </h1>
      <div className="text-muted-foreground">
        {meetingDetails?.isYours ? "Yours" : meetingDetails?.owner?.name}
      </div>
    </div>
  );
}
