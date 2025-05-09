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
    completed,
    createdBy,
    dateString,
    meetingId,
    orgId,
    previousDiscussionId,
  }: {
    completed: boolean;
    createdBy: Id<"users">;
    dateString: string;
    meetingId: Id<"meetings">;
    orgId: Id<"organizations">;
    previousDiscussionId?: Id<"discussions">;
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
    completed,
    createdBy,
    date,
    meetingId,
    orgId,
    previousDiscussionId,
  });
}
// ------------------------------------------------------------

export const complete = authedOrgMutation({
  args: {
    discussionId: v.id("discussions"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const discussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );

    return ctx.db.patch(discussion._id, {
      completed: args.isCompleted,
    });
  },
});
