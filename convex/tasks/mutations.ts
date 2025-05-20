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
    completed,
    createdBy,
    freeformOwner,
    orgId,
    owner,
    text,
    topicId,
  }: {
    completed: boolean;
    createdBy: Id<"users">;
    freeformOwner: string | undefined;
    orgId: Id<"organizations">;
    owner: Id<"users">;
    text: string;
    topicId: Id<"topics">;
  },
) {
  return await db.insert("tasks", {
    completed,
    createdBy,
    freeformOwner,
    orgId,
    owner,
    text,
    topicId,
  });
}
// ------------------------------------------------------------

export const complete = authedOrgMutation({
  args: {
    taskId: v.id("tasks"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const task = await validateTask(ctx.db, args.taskId);
    return ctx.db.patch(task._id, {
      completed: args.isCompleted,
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
      completed: false,
      createdBy: ctx.user._id,
      freeformOwner: args.freeformOwner,
      orgId: ctx.organization._id,
      owner: args.owner,
      text: args.text,
      topicId: topic._id,
    });
  },
});
