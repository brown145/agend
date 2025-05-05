"use client";

import { TopicList } from "@/components/TopicList";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParamIds } from "../../_hooks/useParamIds";

export default function DiscussionPage() {
  const { meetingId, discussionId, organizationId } = useParamIds();

  const meeting = useQuery(
    api.meetings.details,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  );

  const discussion = useQuery(
    api.discussions.details,
    discussionId
      ? {
          discussionId,
        }
      : "skip",
  );

  const meetingOwner = useQuery(
    api.users.details,
    meeting?.owner ? { userId: meeting.owner } : "skip",
  );

  const discussionDate = discussion?._creationTime
    ? new Date(discussion._creationTime)
    : null;

  return (
    <div className="">
      <h1 className="text-2xl font-bold">
        {meeting?.title ?? "Meeting"} -{" "}
        {discussionDate ? discussionDate.toLocaleDateString() : "Unknown"}
      </h1>
      <div>{meetingOwner?.name ?? "Unknown owner"}</div>
      <h2 className="text-lg font-bold">Recap (previous discussion date)</h2>
      <div className="text-sm text-gray-500">TODO</div>
      <h2 className="text-lg font-bold">Topics</h2>
      <div className="">
        {discussionId && meetingId && (
          <TopicList discussionId={discussionId} meetingId={meetingId} />
        )}
      </div>
      <h2 className="text-lg font-bold">Summary</h2>
      <div className="text-sm text-gray-500">TODO</div>
    </div>
  );
}
