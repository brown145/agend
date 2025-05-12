import { customQuery } from "convex-helpers/server/customFunctions";
import { Doc } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { convexInvariant } from "./convexInvariant";
import { validateIdentity } from "./validateIdentity";

export type AuthedCtx = QueryCtx & { user: Doc<"users"> };

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const identity = await validateIdentity(ctx);

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
