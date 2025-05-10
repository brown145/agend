"use client";

import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { TopicList } from "./TopicList";
export default function DiscussionReview({
  discussionId,
  organizationId,
}: {
  discussionId: string;
  organizationId: string;
}) {
  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  if (!discussion) return null;

  if (!discussion.previousDiscussionId) return null;

  return (
    <div>
      <h2 className="text-lg font-bold">Review</h2>
      <PreviousReview
        discussionId={discussion?.previousDiscussionId}
        organizationId={organizationId}
      />
    </div>
  );
}

function PreviousReview({
  discussionId,
  organizationId,
}: {
  discussionId: string;
  organizationId: string;
}) {
  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  return (
    <div className="text-sm text-gray-500">
      From: {formatDiscussionDate(discussion?.date)}
      {organizationId && (
        <TopicList
          discussionId={discussionId}
          editable={false}
          orgId={organizationId}
        />
      )}
    </div>
  );
}
