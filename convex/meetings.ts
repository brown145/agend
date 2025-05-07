import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { authedOrgMutation, authedOrgQuery } from "./utils";

export const list = authedOrgQuery({
  args: { orgId: v.id("organizations") },
  handler: async (ctx) => {
    return ctx.db
      .query("meetings")
      .withIndex("by_orgId_owner", (q) =>
        q.eq("orgId", ctx.organization._id).eq("owner", ctx.user._id),
      )
      .collect();
  },
});

export const details = authedOrgQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<Doc<"meetings"> | null> => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting || meeting.orgId !== ctx.organization._id) {
      throw new Error("Meeting not found");
    }
    return meeting;
  },
});

export const create = authedOrgMutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"meetings">> => {
    // Create the meeting first without nextDiscussionId
    const meetingId = await ctx.db.insert("meetings", {
      title: args.title,
      createdBy: ctx.user._id,
      owner: ctx.user._id,
      orgId: ctx.organization._id,
    });

    // Create the attendance record
    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId: ctx.user._id,
    });

    // Create the next discussion
    const nextDiscussionId = await ctx.db.insert("discussions", {
      completed: false,
      createdBy: ctx.user._id,
      date: "next",
      meetingId,
      orgId: ctx.organization._id,
    });

    // Update the meeting with the nextDiscussionId
    await ctx.db.patch(meetingId, {
      nextDiscussionId,
    });

    return meetingId;
  },
});

export const update = authedOrgMutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.id);
    if (!meeting || meeting.orgId !== ctx.organization._id) {
      throw new Error("Meeting not found");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});

export const start = authedOrgMutation({
  args: {
    meetingId: v.id("meetings"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args): Promise<Id<"discussions">> => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting || meeting.orgId !== ctx.organization._id) {
      throw new Error("Meeting not found");
    }

    // Format current date as YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Create the new discussion
    const newDiscussionId = await ctx.db.insert("discussions", {
      completed: false,
      createdBy: ctx.user._id,
      date: today,
      meetingId: args.meetingId,
      orgId: ctx.organization._id,
    });

    // If there's a nextDiscussionId, move its topics to the new discussion
    if (meeting.nextDiscussionId) {
      const topics = await ctx.db
        .query("topics")
        .withIndex("by_orgId_discussionId", (q) =>
          q
            .eq("orgId", ctx.organization._id)
            .eq("discussionId", meeting.nextDiscussionId!),
        )
        .collect();

      // Move each topic to the new discussion
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
