import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
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
          .withIndex("by_meetingId_discussionId", (q) =>
            q
              .eq("meetingId", args.meetingId)
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
    // ------------------------------------------------------------
    // TODO: Check if the user has access to this discussion
    // ------------------------------------------------------------
    const discussion = await ctx.db.get(args.discussionId);

    if (!discussion) {
      throw new Error("Discussion not found");
    }

    return discussion;
  },
});

export const create = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<Id<"discussions">> => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }
    if (meeting.orgId !== ctx.organization._id) {
      throw new Error("Cannot create discussion in this meeting");
    }

    return await ctx.db.insert("discussions", {
      completed: false,
      createdBy: ctx.user._id,
      meetingId: args.meetingId,
    });
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

    // ------------------------------------------------------------
    // TODO: validate access via orgid
    // ------------------------------------------------------------

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
