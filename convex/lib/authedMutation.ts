import { customMutation } from "convex-helpers/server/customFunctions";
import { UserIdentity } from "convex/server";
import { Doc } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { convexInvariant } from "./convexInvariant";
import { mutation } from "./functions";
import { validateIdentity } from "./validateIdentity";

export type AuthedMutationCtx = MutationCtx & {
  user: Doc<"users">;
  identity: UserIdentity;
};

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const identity = await validateIdentity(ctx);

    // Get the user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    convexInvariant(user, "User not found");

    return { ctx: { ...ctx, user }, args };
  },
});
