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

// TODO: is the really required or could I make more requests in client?
//       I am unsure on the patters to use.. so thinking we should avoid joining till we need to
//       joining does not seem very "convex"y
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

export const previousIncompletedDiscussions = authedOrgQuery({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    // Get the current discussion to find its meeting and creation time
    const currentDiscussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );

    // Get all discussions for the same meeting
    const meetingDiscussions = await getManyFrom(
      ctx.db,
      "discussions",
      "by_meetingId",
      currentDiscussion.meetingId,
    );

    // Filter for incomplete discussions created before the current one
    // Exclude "next" discussions and the current discussion
    const previousDiscussions = meetingDiscussions.filter(
      (discussion) =>
        !discussion.completed &&
        discussion._id !== currentDiscussion._id &&
        discussion._creationTime < currentDiscussion._creationTime &&
        discussion.date !== "next",
    );

    // Sort by creation time descending to get the most recent previous discussion
    previousDiscussions.sort((a, b) => b._creationTime - a._creationTime);

    // Return the array of previous incomplete discussions
    return previousDiscussions;
  },
});
