import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({ signature: v.string() }),

  discussions: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    meetingId: v.id("meetings"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId", ["meetingId"]),

  meetings: defineTable({
    attendees: v.array(v.id("users")),
    createdAt: v.number(),
    createdBy: v.id("users"),
    owner: v.id("users"),
    title: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_owner", ["owner"]),

  tasks: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    owner: v.id("users"),
    text: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_owner", ["owner"])
    .index("by_topicId", ["topicId"]),

  topics: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    discussionId: v.id("discussions"),
    owner: v.id("users"),
    text: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_discussionId", ["discussionId"])
    .index("by_owner", ["owner"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["tokenIdentifier"]),
});
