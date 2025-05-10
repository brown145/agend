"use client";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { TopicList } from "./TopicList";
export default function DiscussionReview({
  discussionId,
  organizationId,
  meetingId,
}: {
  discussionId: string;
  organizationId: string;
  meetingId: string;
}) {
  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: organizationId as Id<"organizations">,
  });

  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  const isNextDiscussion =
    meetingDetails?.nextDiscussionId &&
    discussion?._id === meetingDetails.nextDiscussionId;

  if (isNextDiscussion) return null;

  return (
    <>
      <h2 className="text-lg font-bold">Summary</h2>
      <TopicList
        discussionId={discussionId}
        editable={false}
        orgId={organizationId}
      />
    </>
  );
}
