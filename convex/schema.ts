import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({ signature: v.string() }),
  tasks: defineTable({
    text: v.string(),
    createdBy: v.string(),
    completed: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  }).index("by_createdBy", ["createdBy"]),
});
