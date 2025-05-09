import { customQuery } from "convex-helpers/server/customFunctions";
import { Doc } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { convexInvariant } from "./convexInvariant";

export type AuthedCtx = QueryCtx & { user: Doc<"users"> };

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    convexInvariant(identity !== null, "Not authenticated");

    // Get the user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    convexInvariant(user, "User not found");

    return { ctx: { ...ctx, user }, args };
  },
});
