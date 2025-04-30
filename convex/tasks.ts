import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const listByTopic = query({
  args: {
    topicId: v.id("topics"),
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<Doc<"tasks">[]> => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Use the index to efficiently query tasks for this user and topic
    return await ctx.db
      .query("tasks")
      .withIndex("by_meetingId_topicId", (q) =>
        q.eq("meetingId", args.meetingId).eq("topicId", args.topicId),
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    meetingId: v.id("meetings"),
    topicId: v.id("topics"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    return await ctx.db.insert("tasks", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      meetingId: args.meetingId,
      owner: userId,
      text: args.text,
      topicId: args.topicId,
    });
  },
});

export const update = mutation({
  args: {
    completed: v.boolean(),
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Get the task to verify ownership
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    const meeting = await ctx.db.get(task.meetingId);

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to update this task");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
