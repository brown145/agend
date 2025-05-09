import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { TopicList } from "./TopicList";

export default function DiscussionRecap({
  discussionId,
  organizationId,
}: {
  discussionId: Id<"discussions">;
  organizationId: Id<"organizations">;
}) {
  const discussion = useQuery(
    api.discussions.queries.byDiscussionId,
    discussionId && organizationId
      ? {
          discussionId,
          orgId: organizationId,
        }
      : "skip",
  );

  return (
    <div>
      <h2 className="text-lg font-bold">Review</h2>
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
    </div>
  );
}
