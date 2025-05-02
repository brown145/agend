"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { DiscussionList } from "../_components/DiscussionList";
import { MeetingDetails } from "../_components/MeetingDetails";

export default function MeetingsPage() {
  const params = useParams();
  const meetingId = params.meetingId as Id<"meetings">;
  const meeting = useQuery(
    api.meetings.details,
    meetingId
      ? {
          meetingId,
        }
      : "skip",
  );

  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  return (
    <div className="">
      <MeetingDetails id={meetingId} title={meeting.title} />
      <DiscussionList meetingId={meetingId} />
    </div>
  );
}
