import { isNonNull } from "@/lib/isNotNull";
import { getManyFrom } from "convex-helpers/server/relationships";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { authedQuery } from "../lib/authedQuery";
import { convexInvariant } from "../lib/convexInvariant";
import { validateMeeting } from "../meetings/queries";
import { validateOrg } from "../organizations/queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateUser(db: DatabaseReader, userId: Id<"users">) {
  const user = await db.get(userId);
  convexInvariant(user, "User not found");
  return user;
}
// ------------------------------------------------------------

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
    const attendance = await getManyFrom(
      ctx.db,
      "meetingAttendance",
      "by_meetingId",
      meeting._id,
    );
    return Promise.all(
      attendance.map(async (attendance) => {
        const user = await ctx.db.get(attendance.userId);
        return user;
      }),
    );
  },
});

export const byOrgId = authedOrgQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const org = await validateOrg(ctx.db, args.orgId);

    const orgUsers = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", org._id))
      .collect();

    const users = await Promise.all(
      orgUsers.map(async (orgUser) => ctx.db.get(orgUser.userId)),
    );

    return users.filter(isNonNull).map((user) => ({
      ...user,
      isYou: user._id === ctx.user._id,
    }));
  },
});

export const byUserId = authedOrgQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return validateUser(ctx.db, args.userId);
  },
});

export const current = authedQuery({
  args: {},
  handler: async (ctx) => {
    return validateUser(ctx.db, ctx.user._id);
  },
});
