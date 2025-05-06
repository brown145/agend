import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authVerifiers: defineTable({ signature: v.string() }),

  discussions: defineTable({
    completed: v.boolean(),
    createdBy: v.id("users"),
    date: v.string(), // Format: YYYY-MM-DD / Expected to be unique
    meetingId: v.id("meetings"),
    orgId: v.id("organizations"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId_date", ["meetingId", "date"])
    .index("by_meetingId", ["meetingId"])
    .index("by_orgId", ["orgId"]),

  meetings: defineTable({
    createdBy: v.id("users"),
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
