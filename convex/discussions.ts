import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get all discussions for this user
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Use the subject from identity as the userId
    const userId = identity.subject;

    return await ctx.db.insert("discussions", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
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
