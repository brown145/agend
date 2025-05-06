import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { authedOrgMutation, authedOrgQuery } from "./utils";

export const listByTopic = authedOrgQuery({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args): Promise<Doc<"tasks">[]> => {
    // Use the index to efficiently query tasks for this user and topic
    return await ctx.db
      .query("tasks")
      .withIndex("by_orgId_topicId", (q) =>
        q.eq("orgId", ctx.organization._id).eq("topicId", args.topicId),
      )
      .collect();
  },
});

export const create = authedOrgMutation({
  args: {
    topicId: v.id("topics"),
    text: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    return await ctx.db.insert("tasks", {
      completed: false,
      createdBy: ctx.user._id,
      orgId: ctx.organization._id,
      owner: ctx.user._id,
      text: args.text,
      topicId: args.topicId,
    });
  },
});

export const update = authedOrgMutation({
  args: {
    completed: v.boolean(),
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.orgId !== ctx.organization._id) {
      throw new Error("Cannot update this task");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
