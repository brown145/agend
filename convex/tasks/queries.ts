import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { convexInvariant } from "../lib/convexInvariant";
import { validateTopic } from "../topics/queries";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateTask(db: DatabaseReader, taskId: Id<"tasks">) {
  const task = await db.get(taskId);
  convexInvariant(task, "Task not found");
  return task;
}
// ------------------------------------------------------------

export const byTopicId = authedOrgQuery({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    const topic = await validateTopic(ctx.db, args.topicId);
    return ctx.db
      .query("tasks")
      .withIndex("by_orgId_topicId", (q) =>
        q.eq("orgId", ctx.organization._id).eq("topicId", topic._id),
      )
      .collect();
  },
});
