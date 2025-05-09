import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";
import { createDiscussion } from "../discusssions/mutations";
import { authedOrgMutation } from "../lib/authedOrgMutation";
import { getUserMeetingAttendance, validateMeeting } from "./queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
async function createMeeting(
  db: DatabaseWriter,
  {
    title,
    createdBy,
    orgId,
  }: {
    title: string;
    createdBy: Id<"users">;
    orgId: Id<"organizations">;
  },
) {
  return await db.insert("meetings", {
    title: title.trim(),
    createdBy,
    owner: createdBy,
    orgId,
  });
}
// ------------------------------------------------------------

export const addAttendee = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingAttendance = await getUserMeetingAttendance(
      ctx.db,
      args.meetingId,
      args.userId,
    );

    if (!existingAttendance) {
      await ctx.db.insert("meetingAttendance", {
        meetingId: args.meetingId,
        userId: args.userId,
      });
    }

    return args.meetingId;
  },
});

export const create = authedOrgMutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const meetingId = await createMeeting(ctx.db, {
      title: args.title,
      createdBy: ctx.user._id,
      orgId: ctx.organization._id,
    });

    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId: ctx.user._id,
    });

    const nextDiscussionId = await createDiscussion(ctx.db, {
      completed: false,
      createdBy: ctx.user._id,
      dateString: "next",
      meetingId,
      orgId: ctx.organization._id,
    });

    await ctx.db.patch(meetingId, {
      nextDiscussionId,
    });

    return meetingId;
  },
});

export const removeAttendee = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingAttendance = await getUserMeetingAttendance(
      ctx.db,
      args.meetingId,
      args.userId,
    );

    if (existingAttendance) {
      await ctx.db.delete(existingAttendance._id);
    }

    return args.meetingId;
  },
});

export const start = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const meeting = await validateMeeting(
      ctx.db,
      args.meetingId,
      ctx.organization._id,
    );
    const discussions = await getManyFrom(
      ctx.db,
      "discussions",
      "by_meetingId",
      meeting._id,
    );

    const previousDiscussion = discussions
      .filter(
        (d): d is typeof d & { date: string } =>
          d.date !== "next" && d.date !== null,
      )
      .sort((a, b) => {
        return b.date.localeCompare(a.date);
      })[0];

    const newDiscussionId = await createDiscussion(ctx.db, {
      completed: false,
      createdBy: ctx.user._id,
      dateString: new Date().toISOString(),
      meetingId: args.meetingId,
      orgId: ctx.organization._id,
      previousDiscussionId: previousDiscussion?._id,
    });

    if (meeting.nextDiscussionId) {
      const topics = await getManyFrom(
        ctx.db,
        "topics",
        "by_discussionId",
        meeting.nextDiscussionId,
      );

      await Promise.all(
        topics.map((topic) =>
          ctx.db.patch(topic._id, {
            discussionId: newDiscussionId,
          }),
        ),
      );
    }

    return newDiscussionId;
  },
});
