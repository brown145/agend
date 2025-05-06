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
    // Create the meeting
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
