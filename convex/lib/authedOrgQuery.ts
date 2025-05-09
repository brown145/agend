import { customQuery } from "convex-helpers/server/customFunctions";
import { v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { AuthedCtx, authedQuery } from "./authedQuery";
import { convexInvariant } from "./convexInvariant";

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

    convexInvariant(userOrg, "Not authorized to access this organization");

    const organization = (await authedCtx.db.get(
      orgId,
    )) as Doc<"organizations">;
    convexInvariant(organization, "Organization not found");

    return { ctx: { ...authedCtx, organization }, args: {} };
  },
});
