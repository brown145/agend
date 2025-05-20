import { UserIdentity } from "convex/server";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexInvariant } from "./convexInvariant";

const doImpersonate = false;

const mockIdentity = {
  email: "seth.milchick@lumon.com",
  name: "Seth Milchick",
  subject: "mock-seth-milchick",
} as UserIdentity;

export async function validateIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  convexInvariant(identity, "Not authenticated");

  // User impersonation
  if (doImpersonate) {
    return mockIdentity;
  }

  return identity;
}
