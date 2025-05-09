import { isNonNull } from "@/lib/isNotNull";
import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery, AuthedOrgQueryCtx } from "../lib/authedOrgQuery";
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

export const list = authedOrgQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"meetings">[]> => {
    const authedCtx = ctx as AuthedOrgQueryCtx;
    return ctx.runQuery(api.meetings.queries.byUserId, {
      userId: authedCtx.user._id,
      orgId: authedCtx.organization._id,
    });
  },
});

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
    const meeting = await validateMeeting(
      ctx.db,
      args.meetingId,
      ctx.organization._id,
    );

    const owner = await ctx.db.get(meeting.owner);

    const discussions = await getManyFrom(
      ctx.db,
      "discussions",
      "by_meetingId",
      args.meetingId,
    );

    // TODO: refactor this ???
    const previousDiscussion = discussions
      .filter(
        (d): d is typeof d & { date: string } =>
          d.date !== "next" && d.date !== null,
      )
      .sort((a, b) => {
        return b.date.localeCompare(a.date);
      })[0];

    return {
      ...meeting,
      isYours: meeting.owner === ctx.user._id,
      owner: owner,
      previousDiscussion: previousDiscussion,
    };
  },
});
