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
    createdAt: v.number(),
    createdBy: v.id("users"),
    owner: v.id("users"),
    title: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_owner", ["owner"]),

  meetingAttendance: defineTable({
    meetingId: v.id("meetings"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_meetingId", ["meetingId"])
    .index("by_meetingId_userId", ["meetingId", "userId"])
    .index("by_userId", ["userId"]),

  tasks: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    meetingId: v.id("meetings"),
    owner: v.id("users"),
    text: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId_topicId", ["meetingId", "topicId"])
    .index("by_owner", ["owner"]),

  topics: defineTable({
    completed: v.boolean(),
    createdAt: v.number(),
    createdBy: v.id("users"),
    discussionId: v.id("discussions"),
    meetingId: v.id("meetings"),
    owner: v.id("users"),
    text: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId_discussionId", ["meetingId", "discussionId"])
    .index("by_owner", ["owner"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["tokenIdentifier"]),
});
