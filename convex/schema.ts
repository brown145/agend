import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({ signature: v.string() }),

  topics: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.string(),
    text: v.string(),
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
});
