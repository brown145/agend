import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authedQuery } from "./utils";

export const getUsersFirst = query({
  handler: async (ctx): Promise<Doc<"organizations"> | null> => {
    throw new Error("use authedQuery");
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      return null;
    }

    const userFirstOrg = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

export const details = query({
  handler: async (ctx): Promise<Doc<"organizations"> | null> => {
    throw new Error("use authedQuery");
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user) {
      return null;
    }

    // Get the user's organization through userOrganizations
    const userOrg = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userOrg) {
      return null;
    }

    // Get the organization details
    const organization = await ctx.db.get(userOrg.orgId);
    return organization;
  },
});
