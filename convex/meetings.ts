import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get all meetings for this user
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();

    return meetings;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    return await ctx.db.insert("meetings", {
      title: args.title,
      createdAt: Date.now(),
      createdBy: userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Get the meeting to verify ownership
    const meeting = await ctx.db.get(args.id);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Verify the user owns this meeting
    if (meeting.createdBy !== userId) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});
