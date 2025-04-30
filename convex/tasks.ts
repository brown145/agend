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
    const canView = await ctx.runQuery(api.meetings.canView, {
      meetingId: args.meetingId,
    });

    if (!canView) {
      throw new Error("Not authorized to view tasks in this meeting");
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
    // Get the task to verify ownership
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: task.meetingId,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
