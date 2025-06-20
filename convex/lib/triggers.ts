import { Triggers } from "convex-helpers/server/triggers";
import { DataModel } from "../_generated/dataModel";

export const triggers = new Triggers<DataModel>();

// When a meeting is deleted, delete related records
triggers.register("meetings", async (ctx, change) => {
  if (change.operation === "delete") {
    // Delete all discussions for this meeting
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", change.id))
      .collect();

    await Promise.all(discussions.map((d) => ctx.db.delete(d._id)));

    // Delete all meeting attendance records
    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", change.id))
      .collect();

    await Promise.all(attendance.map((a) => ctx.db.delete(a._id)));
  }
});

// When a discussion is deleted, delete related topics
triggers.register("discussions", async (ctx, change) => {
  if (change.operation === "delete") {
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_discussionId", (q) => q.eq("discussionId", change.id))
      .collect();

    await Promise.all(topics.map((t) => ctx.db.delete(t._id)));
  }
});

// When a topic is deleted, delete related tasks
triggers.register("topics", async (ctx, change) => {
  if (change.operation === "delete") {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_topicId", (q) => q.eq("topicId", change.id))
      .collect();

    await Promise.all(tasks.map((t) => ctx.db.delete(t._id)));
  }
});

// When an organization is deleted, delete related records
triggers.register("organizations", async (ctx, change) => {
  if (change.operation === "delete") {
    // Delete all user-org relationships
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", change.id))
      .collect();

    await Promise.all(userOrgs.map((uo) => ctx.db.delete(uo._id)));

    // Delete all meetings
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_orgId", (q) => q.eq("orgId", change.id))
      .collect();

    await Promise.all(meetings.map((m) => ctx.db.delete(m._id)));
  }
});
