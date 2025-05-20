import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";
import { validateDiscussion } from "../discussions/queries";
import { authedOrgMutation } from "../lib/authedOrgMutation";
import { validateTopic } from "./queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function createTopic(
  db: DatabaseWriter,
  {
    completed,
    createdBy,
    discussionId,
    freeformOwner,
    orgId,
    owner,
    text,
  }: {
    completed: boolean;
    createdBy: Id<"users">;
    discussionId: Id<"discussions">;
    freeformOwner: string | undefined;
    orgId: Id<"organizations">;
    owner: Id<"users">;
    text: string;
  },
) {
  return await db.insert("topics", {
    completed,
    createdBy,
    freeformOwner,
    orgId,
    owner,
    text,
    discussionId,
  });
}
// ------------------------------------------------------------

export const complete = authedOrgMutation({
  args: {
    topicId: v.id("topics"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const topic = await validateTopic(ctx.db, args.topicId);
    return ctx.db.patch(topic._id, {
      completed: args.isCompleted,
    });
  },
});

export const create = authedOrgMutation({
  args: {
    discussionId: v.id("discussions"),
    freeformOwner: v.optional(v.string()),
    text: v.string(),
    owner: v.id("users"),
  },
  handler: async (ctx, args) => {
    const discussion = await validateDiscussion(
      ctx.db,
      args.discussionId,
      ctx.organization._id,
    );

    return createTopic(ctx.db, {
      completed: false,
      createdBy: ctx.user._id,
      discussionId: discussion._id,
      orgId: ctx.organization._id,
      freeformOwner: args.freeformOwner,
      owner: args.owner,
      text: args.text,
    });
  },
});
