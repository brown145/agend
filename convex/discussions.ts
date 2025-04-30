import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type DiscussionWithMetadata = Doc<"discussions"> & {
  metadata: {
    topicsCompleted: boolean;
  };
};

export const listByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<DiscussionWithMetadata[]> => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Get the meeting to verify attendance
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to view discussions in this meeting");
    }

    // Get all discussions for this meeting
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();

    // For each discussion, check if all its topics are completed
    const discussionsWithCompletion = await Promise.all(
      discussions.map(async (discussion) => {
        const topics = await ctx.db
          .query("topics")
          .withIndex("by_meetingId_discussionId", (q) =>
            q
              .eq("meetingId", args.meetingId)
              .eq("discussionId", discussion._id),
          )
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
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Verify the meeting exists and belongs to the user
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }
    if (meeting.createdBy !== userId) {
      throw new Error("Not authorized to create discussion in this meeting");
    }

    return await ctx.db.insert("discussions", {
      completed: false,
      createdAt: Date.now(),
      createdBy: userId,
      meetingId: args.meetingId,
    });
  },
});

export const update = mutation({
  args: {
    completed: v.boolean(),
    id: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Get the discussion to verify meeting access
    const discussion = await ctx.db.get(args.id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    const meeting = await ctx.db.get(discussion.meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.attendees.includes(userId)) {
      throw new Error("Not authorized to update this discussion");
    }

    return await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});
