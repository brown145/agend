import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const update = mutation({
  args: {
    attendees: v.array(v.id("users")),
    id: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: args.id,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    // Get all current attendance records for this meeting
    const currentAttendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.id))
      .collect();

    const attendeesToAdd = new Set<Id<"users">>();
    const attendeesToRemove = new Set<Id<"users">>();
    const attendeesCurrent = new Set(
      currentAttendance.map((record) => record.userId),
    );
    const attendeesNew = new Set(args.attendees);

    const combinedAttendeeIds = new Set([
      ...currentAttendance.map((record) => record.userId),
      ...args.attendees,
    ]);

    combinedAttendeeIds.forEach((id) => {
      if (attendeesCurrent.has(id) && !attendeesNew.has(id)) {
        attendeesToRemove.add(id);
      } else if (!attendeesCurrent.has(id) && attendeesNew.has(id)) {
        attendeesToAdd.add(id);
      }
    });

    // Remove attendees that are no longer in the meeting
    if (attendeesToRemove.size > 0) {
      await Promise.all(
        Array.from(attendeesToRemove)
          .map((userId) => {
            const record = currentAttendance.find(
              (record) => record.userId === userId,
            );
            if (!record) return;
            return ctx.db.delete(record._id);
          })
          .filter(Boolean),
      );
    }

    // Add new attendees
    if (attendeesToAdd.size > 0) {
      await Promise.all(
        Array.from(attendeesToAdd).map((userId) =>
          ctx.db.insert("meetingAttendance", {
            meetingId: args.id,
            userId,
            createdAt: Date.now(),
          }),
        ),
      );
    }

    return args.id;
  },
});
