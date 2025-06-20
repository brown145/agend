import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // TODO: v.union for previous vs next vs actual discussions?
  discussions: defineTable({
    activeStep: v.number(),
    createdBy: v.id("users"),
    date: v.optional(v.string() || "next"), // Format: YYYY-MM-DD
    isClosed: v.boolean(),
    isResolved: v.boolean(),
    meetingId: v.id("meetings"),
    orgId: v.id("organizations"),
  })
    // TODO: cleanup indexes
    .index("by_createdBy", ["createdBy"])
    .index("by_meetingId_date", ["meetingId", "date"])
    .index("by_meetingId", ["meetingId"])
    .index("by_orgId", ["orgId"])
    .index("by_orgId_meetingId", ["orgId", "meetingId"])
    .index("by_isResolved", ["isResolved"]),

  // TODO: v.union for oneTime vs Recurring meetings?
  meetings: defineTable({
    createdBy: v.id("users"),
    nextDiscussionId: v.optional(v.id("discussions")),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    title: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_orgId_owner", ["orgId", "owner"])
    .index("by_orgId", ["orgId"]),

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
  }).index("by_createdBy", ["createdBy"]),

  tasks: defineTable({
    createdBy: v.id("users"),
    freeformOwner: v.optional(v.string()),
    isClosed: v.boolean(),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    text: v.string(),
    topicId: v.id("topics"),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_orgId_topicId", ["orgId", "topicId"])
    .index("by_owner", ["owner"])
    .index("by_topicId", ["topicId"]),

  topics: defineTable({
    createdBy: v.id("users"),
    discussionId: v.id("discussions"),
    freeformOwner: v.optional(v.string()),
    isClosed: v.boolean(),
    isResolved: v.boolean(),
    orgId: v.id("organizations"),
    owner: v.id("users"),
    text: v.string(),
  })
    .index("by_createdBy", ["createdBy"])
    .index("by_discussionId", ["discussionId"])
    .index("by_orgId_discussionId", ["orgId", "discussionId"])
    .index("by_orgId", ["orgId"])
    .index("by_owner", ["owner"])
    .index("by_isResolved", ["isResolved"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    subject: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_subject", ["subject"]),

  userOrganizations: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    isPersonal: v.boolean(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_userId", ["orgId", "userId"])
    .index("by_userId", ["userId"]),
});
