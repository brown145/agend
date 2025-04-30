import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const listByDiscussion = query({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args): Promise<Doc<"topics">[]> => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Get all topics for this user in the specified discussion
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_owner", (q) => q.eq("owner", userId))
      .filter((q) => q.eq(q.field("discussionId"), args.discussionId))
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
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    return await ctx.db.insert("topics", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      owner: userId,
      text: args.text,
      discussionId: args.discussionId,
    });
  },
});

export const update = mutation({
  args: {
    completed: v.boolean(),
    id: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

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
