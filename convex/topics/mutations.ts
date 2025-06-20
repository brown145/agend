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
    createdBy,
    discussionId,
    freeformOwner,
    isClosed,
    isResolved,
    orgId,
    owner,
    text,
  }: {
    createdBy: Id<"users">;
    discussionId: Id<"discussions">;
    freeformOwner: string | undefined;
    isClosed: boolean;
    isResolved: boolean;
    orgId: Id<"organizations">;
    owner: Id<"users">;
    text: string;
  },
) {
  return await db.insert("topics", {
    createdBy,
    discussionId,
    freeformOwner,
    isClosed,
    isResolved,
    orgId,
    owner,
    text,
  });
}
// ------------------------------------------------------------

export const close = authedOrgMutation({
  args: {
    topicId: v.id("topics"),
    isClosed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const topic = await validateTopic(ctx.db, args.topicId);
    return ctx.db.patch(topic._id, {
      isClosed: args.isClosed,
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
      createdBy: ctx.user._id,
      discussionId: discussion._id,
      freeformOwner: args.freeformOwner,
      isClosed: false,
      isResolved: false,
      orgId: ctx.organization._id,
      owner: args.owner,
      text: args.text,
    });
  },
});
