import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx): Promise<Doc<"meetings">[]> => {
    const userId: Id<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!userId) {
      throw new Error("User not found");
    }

    // Get all meetings for this user
    const meetings: Doc<"meetings">[] = await ctx.db
      .query("meetings")
      .withIndex("by_owner", (q) => q.eq("owner", userId))
      .collect();

    return meetings;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"meetings">> => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

    return await ctx.db.insert("meetings", {
      title: args.title,
      createdAt: Date.now(),
      createdBy: userId,
      owner: userId,
      attendees: [userId],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId: Id<"users"> = await ctx.runMutation(api.users.ensureUser, {});

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
