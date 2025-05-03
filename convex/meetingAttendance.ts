import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    userId: v.id("users"),
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: args.meetingId,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    // Check if user is already an attendee
    const existingAttendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingAttendance) {
      return args.meetingId;
    }

    // Add the new attendee
    await ctx.db.insert("meetingAttendance", {
      meetingId: args.meetingId,
      userId: args.userId,
    });

    return args.meetingId;
  },
});

export const remove = mutation({
  args: {
    userId: v.id("users"),
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: args.meetingId,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    // Get all current attendance records for this meeting
    const currentAttendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();

    // Ensure we don't remove the last attendee
    if (currentAttendance.length <= 1) {
      throw new Error("Cannot remove the last attendee from a meeting");
    }

    // Find and remove the specific attendance record
    const recordToRemove = currentAttendance.find(
      (record) => record.userId === args.userId,
    );

    if (recordToRemove) {
      await ctx.db.delete(recordToRemove._id);
    }

    return args.meetingId;
  },
});

export const listByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();
  },
});
