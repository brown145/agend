import { Triggers } from "convex-helpers/server/triggers";
import { GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "../_generated/dataModel";

export const triggers = new Triggers<DataModel>();

// Helper function to update a topic's resolved status
async function updateTopicResolvedStatus(
  ctx: GenericMutationCtx<DataModel>,
  topicId: Id<"topics">,
) {
  const topic = await ctx.db.get(topicId);
  if (!topic) return;

  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_topicId", (q) => q.eq("topicId", topicId))
    .collect();

  const allTasksClosed = tasks.every((task) => task.isClosed);
  const isResolved = topic.isClosed && allTasksClosed;

  if (topic.isResolved !== isResolved) {
    await ctx.db.patch(topic._id, { isResolved });
  }
}

// Helper function to update a discussion's resolved status
async function updateDiscussionResolvedStatus(
  ctx: GenericMutationCtx<DataModel>,
  discussionId: Id<"discussions">,
) {
  const discussion = await ctx.db.get(discussionId);
  if (!discussion) return;

  const topics = await ctx.db
    .query("topics")
    .withIndex("by_discussionId", (q) => q.eq("discussionId", discussionId))
    .collect();

  const allTopicsResolved = topics.every((topic) => topic.isResolved);
  const isResolved = discussion.isClosed && allTopicsResolved;

  if (discussion.isResolved !== isResolved) {
    await ctx.db.patch(discussion._id, { isResolved });
  }
}

// When a meeting is deleted, delete related records
triggers.register("meetings", async (ctx, change) => {
  if (change.operation === "delete") {
    // Delete all discussions for this meeting
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", change.id))
      .collect();

    await Promise.all(discussions.map((d) => ctx.db.delete(d._id)));

    // Delete all meeting attendance records
    const attendance = await ctx.db
      .query("meetingAttendance")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", change.id))
      .collect();

    await Promise.all(attendance.map((a) => ctx.db.delete(a._id)));
  }
});

// When a discussion is deleted, delete related topics
triggers.register("discussions", async (ctx, change) => {
  if (change.operation === "update") {
    // If the discussion's isClosed status changes, its own resolved status needs re-evaluation.
    await updateDiscussionResolvedStatus(ctx, change.newDoc._id);
  } else if (change.operation === "delete") {
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_discussionId", (q) => q.eq("discussionId", change.id))
      .collect();

    await Promise.all(topics.map((t) => ctx.db.delete(t._id)));
  }
});

// When a topic is deleted, delete related tasks
triggers.register("topics", async (ctx, change) => {
  if (change.operation === "insert") {
    // A new topic isn't resolved, so just update its parent.
    await updateDiscussionResolvedStatus(ctx, change.newDoc.discussionId);
  } else if (change.operation === "update") {
    // First, update the topic's own resolved status since its isClosed might have changed.
    await updateTopicResolvedStatus(ctx, change.newDoc._id);

    // Then, update parent(s) because the topic's resolved status might have changed, or it might have moved.
    if (change.oldDoc.discussionId !== change.newDoc.discussionId) {
      // It moved, so the old parent needs an update.
      await updateDiscussionResolvedStatus(ctx, change.oldDoc.discussionId);
    }
    // The new parent always needs an update.
    await updateDiscussionResolvedStatus(ctx, change.newDoc.discussionId);
  } else if (change.operation === "delete") {
    // Update the parent before the topic disappears.
    await updateDiscussionResolvedStatus(ctx, change.oldDoc.discussionId);

    // Then cascade the delete to child tasks.
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_topicId", (q) => q.eq("topicId", change.id))
      .collect();

    await Promise.all(tasks.map((t) => ctx.db.delete(t._id)));
  }
});

triggers.register("tasks", async (ctx, change) => {
  if (change.operation === "insert") {
    await updateTopicResolvedStatus(ctx, change.newDoc.topicId);
  } else if (change.operation === "update") {
    if (change.oldDoc.topicId !== change.newDoc.topicId) {
      // Topic was changed, update both old and new parent.
      await updateTopicResolvedStatus(ctx, change.oldDoc.topicId);
    }
    await updateTopicResolvedStatus(ctx, change.newDoc.topicId);
  } else if (change.operation === "delete") {
    await updateTopicResolvedStatus(ctx, change.oldDoc.topicId);
  }
});

// When an organization is deleted, delete related records
triggers.register("organizations", async (ctx, change) => {
  if (change.operation === "delete") {
    // Delete all user-org relationships
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", change.id))
      .collect();

    await Promise.all(userOrgs.map((uo) => ctx.db.delete(uo._id)));

    // Delete all meetings
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_orgId", (q) => q.eq("orgId", change.id))
      .collect();

    await Promise.all(meetings.map((m) => ctx.db.delete(m._id)));
  }
});
