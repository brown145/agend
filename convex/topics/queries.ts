import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { validateDiscussion } from "../discusssions/queries";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { convexInvariant } from "../lib/convexInvariant";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateTopic(db: DatabaseReader, topicId: Id<"topics">) {
  const topic = await db.get(topicId);
  convexInvariant(topic, "Topic not found");
  return topic;
}
// ------------------------------------------------------------

export const byDiscussionId = authedOrgQuery({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const discussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );
    return getManyFrom(ctx.db, "topics", "by_discussionId", discussion._id);
  },
});
