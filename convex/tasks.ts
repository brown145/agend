import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { authedOrgMutation, authedOrgQuery } from "./utils";

export const listByTopic = authedOrgQuery({
  args: {
    topicId: v.id("topics"),
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<Doc<"tasks">[]> => {
    // ------------------------------------------------------------
    // TODO: validate access via orgid
    // ------------------------------------------------------------

    // Use the index to efficiently query tasks for this user and topic
    return await ctx.db
      .query("tasks")
      .withIndex("by_meetingId_topicId", (q) =>
        q.eq("meetingId", args.meetingId).eq("topicId", args.topicId),
      )
      .collect();
  },
});

export const create = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
    topicId: v.id("topics"),
    text: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"tasks">> => {
    return await ctx.db.insert("tasks", {
      completed: false,
      createdBy: ctx.user._id,
      meetingId: args.meetingId,
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

    // ------------------------------------------------------------
    // TODO: validate access via orgid
    // ------------------------------------------------------------

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
