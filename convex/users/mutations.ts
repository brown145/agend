import { validateIdentity } from "@convex/lib/validateIdentity";
import { getOneFrom } from "convex-helpers/server/relationships";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await validateIdentity(ctx);

    const user = await getOneFrom(
      ctx.db,
      "users",
      "by_subject",
      identity.subject,
      "subject",
    );

    let userId: Id<"users">;
    if (user) {
      userId = user._id;
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
    } else {
      userId = await ctx.db.insert("users", {
        name: identity.name ?? "Anonymous",
        email: identity.email ?? "",
        subject: identity.subject,
      });
    }

    // Check if user has any organizations
    const userOrgs = await ctx.db
      .query("userOrganizations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const personalUserOrg = userOrgs.find((uo) => uo.isPersonal);

    let personalOrgId: Id<"organizations">;
    if (personalUserOrg) {
      personalOrgId = personalUserOrg.orgId;
    } else {
      // Create a personal organization for the user
      personalOrgId = await ctx.db.insert("organizations", {
        name: `Personal organization`,
        createdBy: userId,
      });

      // Create the user-organization relationship
      await ctx.db.insert("userOrganizations", {
        orgId: personalOrgId,
        isPersonal: true,
        userId,
      });
    }

    // Get the final user document to return
    const finalUser = await ctx.db.get(userId);
    if (!finalUser) {
      throw new Error("Failed to retrieve user after creation/update");
    }

    return {
      ...finalUser,
      personalOrgId,
    };
  },
});
