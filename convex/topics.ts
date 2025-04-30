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
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Get the discussion to find the meeting
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Get the meeting to verify attendance
    const meeting = await ctx.db.get(discussion.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to view topics in this discussion");
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
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Get the discussion to find the meeting
    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    // Get the meeting to verify attendance
    const meeting = await ctx.db.get(discussion.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to create topics in this discussion");
    }

    return await ctx.db.insert("topics", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      meetingId: discussion.meetingId,
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

    // Get the topic to verify meeting access
    const topic = await ctx.db.get(args.id);
    if (!topic) {
      throw new Error("Topic not found");
    }

    const meeting = await ctx.db.get(topic.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to update this topic");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
