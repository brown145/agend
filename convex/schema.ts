import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({ signature: v.string() }),

  discussions: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.string(),
  }).index("by_createdBy", ["createdBy"]),

  tasks: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.string(),
    text: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_topicId", ["topicId"]),

  topics: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.string(),
    discussionId: v.id("discussions"),
    text: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_discussionId", ["discussionId"]),
});
