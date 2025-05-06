import { mutation } from "./_generated/server";

export const resetMeetings = mutation({
  args: {},
  handler: async (ctx) => {
    // use process.env.NODE_ENV to check if we are in development mode
    if (process.env.NODE_ENV !== "development") {
      throw new Error("This mutation is only available in development mode");
    }

    // Delete all tasks
    const tasks = await ctx.db.query("tasks").collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    // Delete all topics
    const topics = await ctx.db.query("topics").collect();
    for (const topic of topics) {
      await ctx.db.delete(topic._id);
    }

    // Delete all discussions
    const discussions = await ctx.db.query("discussions").collect();
    for (const discussion of discussions) {
      await ctx.db.delete(discussion._id);
    }

    // Delete all meeting attendance records
    const meetingAttendance = await ctx.db.query("meetingAttendance").collect();
    for (const attendance of meetingAttendance) {
      await ctx.db.delete(attendance._id);
    }

    // Delete all meetings
    const meetings = await ctx.db.query("meetings").collect();
    for (const meeting of meetings) {
      await ctx.db.delete(meeting._id);
    }

    return { success: true };
  },
});
