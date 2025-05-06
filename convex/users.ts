import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { authedMutation, authedOrgQuery } from "./utils";

export const listUsersInOrganization = authedOrgQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"users">[]> => {
    // Get all users in the specified organization
    const orgUsers = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", ctx.organization._id))
      .collect();

    // Get the user documents for all users in the organization
    const users = await Promise.all(
      orgUsers.map(async (orgUser) => {
        const user = await ctx.db.get(orgUser.userId);
        return user;
      }),
    );

    // Filter out any null values in case users were deleted
    return users.filter(
      (user): user is NonNullable<typeof user> => user !== null,
    );
  },
});

export const listByMeeting = authedOrgQuery({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    // ------------------------------------------------------------
    // TODO: org validation
    // not sure if this is needed on meetingAttendance...
    // probably want it on the user fetch
    // ------------------------------------------------------------
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

export const ensureUser = authedMutation({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", ctx.identity.tokenIdentifier),
      )
      .unique();

    let userId: Id<"users">;
    if (user !== null) {
      // If we've seen this identity before but the name has changed, update it
      if (
        user.name !== ctx.identity.name ||
        user.email !== ctx.identity.email
      ) {
        await ctx.db.patch(user._id, {
          name: ctx.identity.name,
          email: ctx.identity.email,
        });
      }
      userId = user._id;
    } else {
      // If it's a new identity, create a new user
      userId = await ctx.db.insert("users", {
        name: ctx.identity.name ?? "Anonymous",
        email: ctx.identity.email ?? "",
        tokenIdentifier: ctx.identity.tokenIdentifier,
      });
    }

    // Check if user has any organizations
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (userOrgs.length === 0) {
      // Create a personal organization for the user
      const orgId = await ctx.db.insert("organizations", {
        name: `Personal organization`,
        isPersonal: true,
        createdBy: userId,
      });

      // Create the user-organization relationship
      await ctx.db.insert("userOrganizations", {
        orgId,
        userId,
      });
    }

    // Get the final user document to return
    const finalUser = await ctx.db.get(userId);
    if (!finalUser) {
      throw new Error("Failed to retrieve user after creation/update");
    }
    return finalUser;
  },
});

export const details = authedOrgQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // ------------------------------------------------------------
    // TODO: validate access via orgid
    // ------------------------------------------------------------

    return await ctx.db.get(args.userId);
  },
});
