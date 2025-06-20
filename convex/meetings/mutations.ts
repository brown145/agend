import { convexInvariant } from "@convex/lib/convexInvariant";
import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";
import { createDiscussion } from "../discussions/mutations";
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
    ownerId,
    orgId,
  }: {
    title: string;
    createdBy: Id<"users">;
    ownerId: Id<"users">;
    orgId: Id<"organizations">;
  },
) {
  return await db.insert("meetings", {
    title: title.trim(),
    createdBy,
    owner: ownerId,
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
    ownerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const meetingId = await createMeeting(ctx.db, {
      title: args.title,
      createdBy: ctx.user._id,
      ownerId: args.ownerId ?? ctx.user._id,
      orgId: ctx.organization._id,
    });

    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId: ctx.user._id,
    });

    const nextDiscussionId = await createDiscussion(ctx.db, {
      createdBy: ctx.user._id,
      dateString: "next",
      isClosed: false,
      isResolved: false,
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

    const newDiscussionId = await createDiscussion(ctx.db, {
      createdBy: ctx.user._id,
      dateString: new Date().toISOString(),
      isClosed: false,
      isResolved: false,
      meetingId: args.meetingId,
      orgId: ctx.organization._id,
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

export const update = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const meeting = await validateMeeting(
      ctx.db,
      args.meetingId,
      ctx.organization._id,
    );

    const userMeeingOrg = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId_userId", (q) =>
        q.eq("orgId", meeting.orgId).eq("userId", ctx.user._id),
      )
      .first();

    convexInvariant(
      userMeeingOrg,
      "User is not a member of the meeting's organization",
    );

    await ctx.db.patch(meeting._id, {
      title: args.title,
    });
  },
});
