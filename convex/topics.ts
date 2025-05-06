import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { authedOrgMutation, authedOrgQuery } from "./utils";

type TopicWithMetadata = Doc<"topics"> & {
  metadata: {
    tasksCompleted: boolean;
  };
};

export const listByDiscussion = authedOrgQuery({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args): Promise<TopicWithMetadata[]> => {
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Get all topics for this discussion
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_orgId_discussionId", (q) =>
        q
          .eq("orgId", ctx.organization._id)
          .eq("discussionId", args.discussionId),
      )
      .collect();

    // For each topic, check if all its tasks are completed
    const topicsWithCompletion = await Promise.all(
      topics.map(async (topic) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_orgId_topicId", (q) =>
            q.eq("orgId", ctx.organization._id).eq("topicId", topic._id),
          )
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

export const create = authedOrgMutation({
  args: {
    text: v.string(),
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args): Promise<Id<"topics">> => {
    // Get the discussion to find the meeting
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Check if user is an attendee using meetingAttendance table
    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", discussion.meetingId).eq("userId", ctx.user._id),
      )
      .first();

    if (!attendance) {
      throw new Error("Not authorized to create topics in this discussion");
    }

    return await ctx.db.insert("topics", {
      completed: false,
      createdBy: ctx.user._id,
      orgId: ctx.organization._id,
      owner: ctx.user._id,
      text: args.text,
      discussionId: args.discussionId,
    });
  },
});

export const update = authedOrgMutation({
  args: {
    completed: v.boolean(),
    id: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.id);
    if (!topic) {
      throw new Error("Topic not found");
    }

    if (topic.orgId !== ctx.organization._id) {
      throw new Error("Cannot update this topic");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
