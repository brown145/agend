import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { UserIdentity } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

type AuthedCtx = QueryCtx & { user: Doc<"users"> };

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated!");
    }

    // Get the user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return { ctx: { ...ctx, user }, args: {} };
  },
});

export const authedOrgQuery = customQuery(authedQuery, {
  args: { orgId: v.id("organizations") },
  input: async (ctx, args) => {
    const authedCtx = ctx as AuthedCtx;
    const { orgId } = args;

    const userOrg = await authedCtx.db
      .query("userOrganizations")
      .withIndex("by_orgId_userId", (q) =>
        q.eq("orgId", orgId).eq("userId", authedCtx.user._id),
      )
      .first();

    if (!userOrg) {
      throw new ConvexError("Not authorized to access this organization");
    }

    const organization = (await authedCtx.db.get(
      orgId,
    )) as Doc<"organizations">;
    if (!organization) {
      throw new ConvexError("Organization not found");
    }

    return { ctx: { ...authedCtx, organization }, args: {} };
  },
});

type AuthedMutationCtx = MutationCtx & {
  user: Doc<"users">;
  identity: UserIdentity;
};

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError("Not authenticated!");
    }

    // Get the user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return { ctx: { ...ctx, user }, args: {} };
  },
});

export const authedOrgMutation = customMutation(authedMutation, {
  args: { orgId: v.id("organizations") },
  input: async (ctx, args) => {
    const authedCtx = ctx as AuthedMutationCtx;
    const { orgId } = args;

    const userOrg = await authedCtx.db
      .query("userOrganizations")
      .withIndex("by_orgId_userId", (q) =>
        q.eq("orgId", orgId).eq("userId", authedCtx.user._id),
      )
      .first();

    if (!userOrg) {
      throw new ConvexError("Not authorized to access this organization");
    }

    const organization = (await authedCtx.db.get(
      orgId,
    )) as Doc<"organizations">;
    if (!organization) {
      throw new ConvexError("Organization not found");
    }

    return { ctx: { ...authedCtx, organization }, args: {} };
  },
});
