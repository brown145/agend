import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { authedOrgMutation, authedOrgQuery } from "./utils";

type DiscussionWithMetadata = Doc<"discussions"> & {
  metadata: {
    topicsCompleted: boolean;
  };
};

export const listByMeeting = authedOrgQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<DiscussionWithMetadata[]> => {
    // Get all discussions for this meeting
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();

    // For each discussion, check if all its topics are completed
    const discussionsWithCompletion = await Promise.all(
      discussions.map(async (discussion) => {
        const topics = await ctx.db
          .query("topics")
          .withIndex("by_orgId_discussionId", (q) =>
            q
              .eq("orgId", ctx.organization._id)
              .eq("discussionId", discussion._id),
          )
          .collect();

        const topicsCompleted = topics.every((topic) => topic.completed);

        return {
          ...discussion,
          metadata: {
            topicsCompleted,
          },
        };
      }),
    );

    return discussionsWithCompletion;
  },
});

export const details = authedOrgQuery({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const discussion = await ctx.db.get(args.discussionId);

    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (discussion.orgId !== ctx.organization._id) {
      throw new Error("Cannot access this discussion");
    }

    return discussion;
  },
});

export const update = authedOrgMutation({
  args: {
    completed: v.boolean(),
    id: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    // Get the discussion to verify meeting access
    const discussion = await ctx.db.get(args.id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (discussion.orgId !== ctx.organization._id) {
      throw new Error("Cannot update this discussion");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
