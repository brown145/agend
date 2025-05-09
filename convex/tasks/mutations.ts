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
    orgId,
    owner,
    text,
    topicId,
  }: {
    completed: boolean;
    createdBy: Id<"users">;
    orgId: Id<"organizations">;
    owner: Id<"users">;
    text: string;
    topicId: Id<"topics">;
  },
) {
  return await db.insert("tasks", {
    completed,
    createdBy,
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
    topicId: v.id("topics"),
    text: v.string(),
    owner: v.id("users"),
  },
  handler: async (ctx, args) => {
    const topic = await validateTopic(ctx.db, args.topicId);
    return createTask(ctx.db, {
      completed: false,
      createdBy: ctx.user._id,
      orgId: ctx.organization._id,
      owner: args.owner,
      text: args.text,
      topicId: topic._id,
    });
  },
});
