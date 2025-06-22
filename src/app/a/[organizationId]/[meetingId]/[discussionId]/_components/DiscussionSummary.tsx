"use client";

import {
  useAuthedQuery as useQuery,
  useAuthedQueryWithCache as useQueryWithCache,
} from "@/hooks/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { TopicList } from "./TopicList";

export default function DiscussionSummary({
  discussionId,
  organizationId,
  meetingId,
}: {
  discussionId: string;
  organizationId: string;
  meetingId: string;
}) {
  const { data: meetingDetails } = useQueryWithCache(
    api.meetings.queries.byMeetingId,
    {
      meetingId: meetingId as Id<"meetings">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  const { data: discussion } = useQuery(
    api.discussions.queries.byDiscussionId,
    {
      discussionId: discussionId as Id<"discussions">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  const isNextDiscussion =
    meetingDetails?.nextDiscussionId &&
    discussion?._id === meetingDetails.nextDiscussionId;

  if (isNextDiscussion) return null;

  return (
    <TopicList
      addable={false}
      completeable={false}
      discussionId={discussionId}
      orgId={organizationId}
      showEmptyState={true}
    />
  );
}
