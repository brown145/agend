import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const details = query({
  handler: async (ctx): Promise<Doc<"organizations"> | null> => {
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.findUser,
      {},
    );
    if (!user || !user.organizationId) {
      return null;
    }
    const organization: Doc<"organizations"> | null = await ctx.db.get(
      user.organizationId,
    );
    return organization;
  },
});
