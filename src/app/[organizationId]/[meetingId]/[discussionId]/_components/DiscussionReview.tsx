"use client";

import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { TopicList } from "./TopicList";

export default function DiscussionReview({
  disabled = false,
  discussionId,
  organizationId,
}: {
  disabled: boolean;
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
    <PreviousReview
      disabled={disabled}
      discussionId={discussion?.previousDiscussionId}
      organizationId={organizationId}
    />
  );
}

function PreviousReview({
  disabled,
  discussionId,
  organizationId,
}: {
  disabled: boolean;
  discussionId: string;
  organizationId: string;
}) {
  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  return (
    <div>
      <div className="text-sm text-gray-500">
        From: {formatDiscussionDate(discussion?.date)}
      </div>
      {organizationId && (
        <TopicList
          disabled={disabled}
          discussionId={discussionId}
          editable={false}
          orgId={organizationId}
        />
      )}
    </div>
  );
}
