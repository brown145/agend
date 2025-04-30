import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const listUsersByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();

    // Get all users from the attendance records
    const users = await Promise.all(
      attendance.map(async (record) => {
        const user = await ctx.db.get(record.userId);
        return user;
      }),
    );

    // Filter out any null values in case users were deleted
    return users.filter(
      (user): user is NonNullable<typeof user> => user !== null,
    );
  },
});
