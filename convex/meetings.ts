import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx): Promise<Doc<"meetings">[]> => {
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      throw new Error("User not found");
    }

    // Get all meetings where user is an attendee using the meetingAttendance table
    const attendanceRecords = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Get the meetings for these attendance records
    const meetings = await Promise.all(
      attendanceRecords.map((record) => ctx.db.get(record.meetingId)),
    );

    // Filter out any null meetings (shouldn't happen, but TypeScript needs it)
    return meetings.filter((m): m is Doc<"meetings"> => m !== null);
  },
});

export const canEdit = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      throw new Error("User not found");
    }

    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", user._id),
      )
      .first();

    return !!attendance;
  },
});

export const canView = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      throw new Error("User not found");
    }

    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", user._id),
      )
      .first();

    return !!attendance;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"meetings">> => {
    const user = await ctx.runQuery(api.users.findUser, {});

    // Create the meeting
    const meetingId = await ctx.db.insert("meetings", {
      title: args.title,
      createdBy: user._id,
      owner: user._id,
    });

    // Create the attendance record
    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId: user._id,
    });

    return meetingId;
  },
});

export const update = mutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: args.id,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});
