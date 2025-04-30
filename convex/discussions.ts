import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get all discussions for this meeting
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .filter((q) => q.eq(q.field("createdBy"), userId))
      .collect();

    // For each discussion, check if all its topics are completed
    const discussionsWithCompletion = await Promise.all(
      discussions.map(async (discussion) => {
        const topics = await ctx.db
          .query("topics")
          .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
          .filter((q) => q.eq(q.field("discussionId"), discussion._id))
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

export const create = mutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Verify the meeting exists and belongs to the user
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }
    if (meeting.createdBy !== userId) {
      throw new Error("Not authorized to create discussion in this meeting");
    }

    return await ctx.db.insert("discussions", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      meetingId: args.meetingId,
    });
  },
});

export const update = mutation({
  args: {
    completed: v.boolean(),
    id: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get the discussion to verify ownership
    const discussion = await ctx.db.get(args.id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Verify the user owns this discussion
    if (discussion.createdBy !== userId) {
      throw new Error("Not authorized to update this discussion");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
