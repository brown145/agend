import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authedOrgMutation, authedOrgQuery } from "./utils";

export const list = authedOrgQuery({
  args: { orgId: v.id("organizations") },
  handler: async (ctx) => {
    return ctx.db
      .query("meetings")
      .withIndex("by_orgId_owner", (q) =>
        q.eq("orgId", ctx.organization._id).eq("owner", ctx.user._id),
      )
      .collect();
  },
});

export const details = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<Doc<"meetings"> | null> => {
    throw new Error("use authedOrgQuery");
    const canView = await ctx.runQuery(api.meetings.canView, {
      meetingId: args.meetingId,
    });
    if (!canView) {
      throw new Error("Not authorized to view this meeting");
    }

    return await ctx.db.get(args.meetingId);
  },
});

// TODO: can this be deleted:
export const canEdit = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    throw new Error("use authedOrgQuery");
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      throw new Error("User not found");
    }

    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", user._id),
      )
      .first();

    return !!attendance;
  },
});

// TODO: can this be deleted:
export const canView = query({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    throw new Error("use authedOrgQuery");
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      throw new Error("User not found");
    }

    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", user._id),
      )
      .first();

    return !!attendance;
  },
});

export const create = authedOrgMutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"meetings">> => {
    throw new Error("use authedOrgMutation");
    const user = await ctx.runQuery(api.users.findUser, {});

    // Create the meeting
    const meetingId = await ctx.db.insert("meetings", {
      title: args.title,
      createdBy: user._id,
      owner: user._id,
      orgId: ctx.organization._id,
    });

    // Create the attendance record
    await ctx.db.insert("meetingAttendance", {
      meetingId,
      userId: user._id,
    });

    return meetingId;
  },
});

export const update = mutation({
  args: {
    id: v.id("meetings"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    throw new Error("use authedOrgMutation");
    const canEdit = await ctx.runQuery(api.meetings.canEdit, {
      meetingId: args.id,
    });

    if (!canEdit) {
      throw new Error("Not authorized to update this meeting");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
    });
  },
});
