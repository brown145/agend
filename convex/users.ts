import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const listUsersInOrganization = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">[]> => {
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.organizationId) {
      throw new Error("User is not part of an organization");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", user.organizationId),
      )
      .collect();
  },
});

export const listByMeeting = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
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
  handler: async (ctx): Promise<Id<"users">> => {
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

    if (user !== null) {
      // If we've seen this identity before but the name has changed, update it
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new user
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const findUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
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
