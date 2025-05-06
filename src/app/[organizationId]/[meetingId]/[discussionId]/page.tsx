"use client";

import { TopicList } from "@/components/TopicList";
import { formatDiscussionDate } from "@/lib/utils/date";
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
    discussionId && organizationId
      ? {
          discussionId,
          orgId: organizationId,
        }
      : "skip",
  );

  const meetingOwner = useQuery(
    api.users.details,
    meeting?.owner && organizationId
      ? { userId: meeting.owner, orgId: organizationId }
      : "skip",
  );

  const discussionDate = formatDiscussionDate(discussion?.date);

  return (
    <div className="">
      <h1 className="text-2xl font-bold">
        {meeting?.title ?? "Meeting"} - {discussionDate}
      </h1>
      <div>{meetingOwner?.name ?? "Unknown owner"}</div>
      <h2 className="text-lg font-bold">Recap (previous discussion date)</h2>
      <div className="text-sm text-gray-500">TODO</div>
      <h2 className="text-lg font-bold">Topics</h2>
      <div className="">
        {discussionId && organizationId && (
          <TopicList discussionId={discussionId} orgId={organizationId} />
        )}
      </div>
      <h2 className="text-lg font-bold">Summary</h2>
      <div className="text-sm text-gray-500">TODO</div>
    </div>
  );
}
