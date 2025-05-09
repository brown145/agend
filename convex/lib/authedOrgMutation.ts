import { customMutation } from "convex-helpers/server/customFunctions";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { authedMutation, AuthedMutationCtx } from "./authedMutation";
import { convexInvariant } from "./convexInvariant";

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

    convexInvariant(userOrg, "Not authorized to access this organization");

    const organization = (await authedCtx.db.get(
      orgId,
    )) as Doc<"organizations">;
    convexInvariant(organization, "Organization not found");

    return { ctx: { ...authedCtx, organization }, args: {} };
  },
});
