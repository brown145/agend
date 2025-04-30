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

    // Get all topics for this user
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();

    // For each topic, check if all its tasks are completed
    const topicsWithCompletion = await Promise.all(
      topics.map(async (topic) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_topicId", (q) => q.eq("topicId", topic._id))
          .collect();

        const tasksCompleted = tasks.every((task) => task.completed);

        return {
          ...topic,
          metadata: {
            tasksCompleted,
          },
        };
      }),
    );

    return topicsWithCompletion;
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Use the subject from identity as the userId
    const userId = identity.subject;

    return await ctx.db.insert("topics", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      text: args.text,
    });
  },
});

export const update = mutation({
  args: {
    completed: v.boolean(),
    id: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get the topic to verify ownership
    const topic = await ctx.db.get(args.id);
    if (!topic) {
      throw new Error("Topic not found");
    }

    // Verify the user owns this topic
    if (topic.createdBy !== userId) {
      throw new Error("Not authorized to update this topic");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
