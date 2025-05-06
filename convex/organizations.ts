import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { authedOrgQuery, authedQuery } from "./utils";

export const getUsersFirst = authedOrgQuery({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx): Promise<Doc<"organizations"> | null> => {
    const userFirstOrg = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .first();

    if (!userFirstOrg) {
      return null;
    }

    return ctx.db.get(userFirstOrg.orgId);
  },
});

export const list = authedQuery({
  handler: async (ctx): Promise<Doc<"organizations">[]> => {
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    // Fetch all organizations the user has access to
    const organizations = await Promise.all(
      userOrgs.map((userOrg) => ctx.db.get(userOrg.orgId)),
    );

    return organizations.filter(
      (org): org is Doc<"organizations"> => org !== null,
    );
  },
});
