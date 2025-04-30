import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx): Promise<Doc<"meetings">[]> => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Get all meetings where user is an attendee using the meetingAttendance table
    const attendanceRecords = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Get the meetings for these attendance records
    const meetings = await Promise.all(
      attendanceRecords.map((record) => ctx.db.get(record.meetingId)),
    );

    // Filter out any null meetings (shouldn't happen, but TypeScript needs it)
    return meetings.filter((m): m is Doc<"meetings"> => m !== null);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"meetings">> => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Create the meeting
    const meetingId = await ctx.db.insert("meetings", {
      title: args.title,
      createdAt: Date.now(),
      createdBy: userId,
      owner: userId,
    });

    // Create the attendance record
    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId,
      createdAt: Date.now(),
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
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    // Get the meeting to verify ownership
    const meeting = await ctx.db.get(args.id);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Verify the user owns this meeting
    if (meeting.createdBy !== userId) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});
