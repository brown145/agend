import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";
import { authedOrgMutation } from "../lib/authedOrgMutation";
import { validateDiscussion } from "./queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function createDiscussion(
  db: DatabaseWriter,
  {
    createdBy,
    dateString,
    isClosed,
    isResolved,
    meetingId,
    orgId,
  }: {
    createdBy: Id<"users">;
    dateString: string | "next";
    isClosed: boolean;
    isResolved: boolean;
    meetingId: Id<"meetings">;
    orgId: Id<"organizations">;
  },
) {
  let date: string;
  if (dateString === "next") {
    date = "next";
  } else {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    date = dateObj.toISOString().split("T")[0];
  }

  return await db.insert("discussions", {
    activeStep: 0,
    createdBy,
    date,
    isClosed,
    isResolved,
    meetingId,
    orgId,
  });
}
// ------------------------------------------------------------

export const close = authedOrgMutation({
  args: {
    discussionId: v.id("discussions"),
    isClosed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const discussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );

    return ctx.db.patch(discussion._id, {
      isClosed: args.isClosed,
    });
  },
});

export const updateActiveStep = authedOrgMutation({
  args: {
    discussionId: v.id("discussions"),
    activeStep: v.number(),
  },
  handler: async (ctx, args) => {
    const discussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );

    return ctx.db.patch(discussion._id, {
      activeStep: args.activeStep,
    });
  },
});
