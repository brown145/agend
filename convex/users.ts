import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const listUsersInOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args): Promise<Doc<"users">[]> => {
    throw new Error("use authedOrgQuery");
    // Get all users in the specified organization
    const orgUsers = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId_userId", (q) => q.eq("orgId", args.organizationId))
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

export const listByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    throw new Error("use authedOrgQuery");
    const canView = await ctx.runQuery(api.meetings.canView, {
      meetingId: args.meetingId,
    });

    if (!canView) {
      throw new Error("Not authorized to view this meeting");
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

export const ensureUser = mutation({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    let userId: Id<"users">;
    if (user !== null) {
      // If we've seen this identity before but the name has changed, update it
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      userId = user._id;
    } else {
      // If it's a new identity, create a new user
      userId = await ctx.db.insert("users", {
        name: identity.name ?? "Anonymous",
        email: identity.email ?? "",
        tokenIdentifier: identity.tokenIdentifier,
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

// @deprecated -> thinking we may want to remove this
export const findUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
    throw new Error("deprecated");
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Only look up existing users
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const details = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    throw new Error("use authedOrgQuery");
    const currentUser = await ctx.runQuery(api.users.findUser, {});

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(args.userId);
  },
});
