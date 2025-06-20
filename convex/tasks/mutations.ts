import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";
import { authedOrgMutation } from "../lib/authedOrgMutation";
import { validateTopic } from "../topics/queries";
import { validateTask } from "./queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function createTask(
  db: DatabaseWriter,
  {
    createdBy,
    freeformOwner,
    isClosed,
    orgId,
    owner,
    text,
    topicId,
  }: {
    createdBy: Id<"users">;
    freeformOwner: string | undefined;
    isClosed: boolean;
    orgId: Id<"organizations">;
    owner: Id<"users">;
    text: string;
    topicId: Id<"topics">;
  },
) {
  return await db.insert("tasks", {
    createdBy,
    freeformOwner,
    isClosed,
    orgId,
    owner,
    text,
    topicId,
  });
}
// ------------------------------------------------------------

export const close = authedOrgMutation({
  args: {
    taskId: v.id("tasks"),
    isClosed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const task = await validateTask(ctx.db, args.taskId);
    return ctx.db.patch(task._id, {
      isClosed: args.isClosed,
    });
  },
});

export const create = authedOrgMutation({
  args: {
    freeformOwner: v.optional(v.string()),
    owner: v.id("users"),
    text: v.string(),
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const topic = await validateTopic(ctx.db, args.topicId);

    return createTask(ctx.db, {
      createdBy: ctx.user._id,
      freeformOwner: args.freeformOwner,
      isClosed: false,
      orgId: ctx.organization._id,
      owner: args.owner,
      text: args.text,
      topicId: topic._id,
    });
  },
});
