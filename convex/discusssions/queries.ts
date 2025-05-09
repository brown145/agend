import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { convexInvariant } from "../lib/convexInvariant";
import { validateMeeting } from "../meetings/queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateDiscussion(
  db: DatabaseReader,
  discussionId: Id<"discussions">,
  orgId: Id<"organizations">,
) {
  const discussion = await db.get(discussionId);
  convexInvariant(discussion, "Discussion not found");
  convexInvariant(discussion.orgId === orgId, "Cannot access this discussion");
  return discussion;
}
// ------------------------------------------------------------

export const byDiscussionId = authedOrgQuery({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    return await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );
  },
});

type DiscussionWithTopics = Doc<"discussions"> & {
  topics: Doc<"topics">[];
};

export const byMeetingId = authedOrgQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<DiscussionWithTopics[]> => {
    const meeting = await validateMeeting(
      ctx.db,
      args.meetingId,
      ctx.organization._id,
    );
    const discussions = await getManyFrom(
      ctx.db,
      "discussions",
      "by_meetingId",
      meeting._id,
    );

    const discussionsWithTopics = await Promise.all(
      discussions.map(async (discussion) => {
        const topics = await getManyFrom(
          ctx.db,
          "topics",
          "by_discussionId",
          discussion._id,
        );
        return { ...discussion, topics };
      }),
    );

    return discussionsWithTopics;
  },
});
