import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({
    signature: v.string(),
  }),

  discussions: defineTable({
    completed: v.boolean(),
    createdBy: v.id("users"),
    date: v.optional(v.string() || "next"), // Format: YYYY-MM-DD
    meetingId: v.id("meetings"),
    orgId: v.id("organizations"),
    previousDiscussionId: v.optional(v.id("discussions")),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId_date", ["meetingId", "date"])
    .index("by_meetingId", ["meetingId"])
    .index("by_orgId", ["orgId"])
    .index("by_orgId_meetingId", ["orgId", "meetingId"])
    .index("by_previousDiscussionId", ["previousDiscussionId"]),

  meetings: defineTable({
    createdBy: v.id("users"),
    nextDiscussionId: v.optional(v.id("discussions")),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    title: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_orgId_owner", ["orgId", "owner"]),

  meetingAttendance: defineTable({
    meetingId: v.id("meetings"),
    userId: v.id("users"),
  })
    .index("by_meetingId", ["meetingId"])
    .index("by_meetingId_userId", ["meetingId", "userId"])
    .index("by_userId", ["userId"]),

  organizations: defineTable({
    createdBy: v.id("users"),
    name: v.string(),
    isPersonal: v.boolean(),
  }).index("by_createdBy", ["createdBy"]),

  tasks: defineTable({
    completed: v.boolean(),
    createdBy: v.id("users"),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    text: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_orgId_topicId", ["orgId", "topicId"])
    .index("by_owner", ["owner"]),

  topics: defineTable({
    completed: v.boolean(),
    createdBy: v.id("users"),
    discussionId: v.id("discussions"),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    text: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_orgId_discussionId", ["orgId", "discussionId"])
    .index("by_orgId", ["orgId"])
    .index("by_owner", ["owner"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["tokenIdentifier"]),

  userOrganizations: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
  })
    .index("by_orgId_userId", ["orgId", "userId"])
    .index("by_userId", ["userId"]),
});
