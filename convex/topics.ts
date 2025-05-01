import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type TopicWithMetadata = Doc<"topics"> & {
  metadata: {
    tasksCompleted: boolean;
  };
};

export const listByDiscussion = query({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args): Promise<TopicWithMetadata[]> => {
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    const canView = await ctx.runQuery(api.meetings.canView, {
      meetingId: discussion.meetingId,
    });

    if (!canView) {
      throw new Error("Not authorized to view topics in this meeting");
    }

    // Get all topics for this discussion
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_meetingId_discussionId", (q) =>
        q
          .eq("meetingId", discussion.meetingId)
          .eq("discussionId", args.discussionId),
      )
      .collect();

    // For each topic, check if all its tasks are completed
    const topicsWithCompletion = await Promise.all(
      topics.map(async (topic) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_meetingId_topicId", (q) =>
            q.eq("meetingId", discussion.meetingId).eq("topicId", topic._id),
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

export const create = mutation({
  args: {
    text: v.string(),
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args): Promise<Id<"topics">> => {
    const user = await ctx.runQuery(api.users.findUser, {});

    // Get the discussion to find the meeting
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Check if user is an attendee using meetingAttendance table
    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", discussion.meetingId).eq("userId", user._id),
      )
      .first();

    if (!attendance) {
      throw new Error("Not authorized to create topics in this discussion");
    }

    return await ctx.db.insert("topics", {
      completed: false,
      createdBy: user._id,
      meetingId: discussion.meetingId,
      owner: user._id,
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
    const topic = await ctx.db.get(args.id);
    if (!topic) {
      throw new Error("Topic not found");
    }

    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: topic.meetingId,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
