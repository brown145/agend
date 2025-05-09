import { isNonNull } from "@/lib/isNotNull";
import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { convexInvariant } from "../lib/convexInvariant";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateMeeting(
  db: DatabaseReader,
  meetingId: Id<"meetings">,
  orgId: Id<"organizations">,
) {
  const meeting = await db.get(meetingId);
  convexInvariant(meeting, "Meeting not found");
  convexInvariant(meeting.orgId === orgId, "Cannot access this meeting");
  return meeting;
}

export async function getUserMeetingAttendance(
  db: DatabaseReader,
  meetingId: Id<"meetings">,
  userId: Id<"users">,
) {
  return await db
    .query("meetingAttendance")
    .withIndex("by_meetingId_userId", (q) =>
      q.eq("meetingId", meetingId).eq("userId", userId),
    )
    .first();
}
// ------------------------------------------------------------

export const byUserId = authedOrgQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const meetingAttendances = await getManyFrom(
      ctx.db,
      "meetingAttendance",
      "by_userId",
      args.userId,
    );

    const meetings = (
      await Promise.all(
        meetingAttendances.map(async (ma) => await ctx.db.get(ma.meetingId)),
      )
    ).filter(isNonNull);

    return meetings;
  },
});

export const byMeetingId = authedOrgQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    return await validateMeeting(ctx.db, args.meetingId, ctx.organization._id);
  },
});
