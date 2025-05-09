import { isNonNull } from "@/lib/isNotNull";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { authedOrgQuery } from "../lib/authedOrgQuery";
import { convexInvariant } from "../lib/convexInvariant";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------
export async function validateOrg(
  db: DatabaseReader,
  orgId: Id<"organizations">,
) {
  const org = await db.get(orgId);
  convexInvariant(org, "Organization not found");
  return org;
}
// ------------------------------------------------------------

export const list = authedOrgQuery({
  args: {},
  handler: async (ctx) => {
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    const orgs = (
      await Promise.all(userOrgs.map(async (uo) => await ctx.db.get(uo.orgId)))
    ).filter(isNonNull);

    return orgs;
  },
});
