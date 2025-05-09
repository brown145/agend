import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";

// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------

function orgDocToOrgObject(org: Doc<"organizations">) {
  return {
    name: org.name,
    id: org._id.toString(),
  };
}
// ------------------------------------------------------------

export function useOrgs({ orgId }: { orgId: string }) {
  orgId = orgId.trim();
  if (orgId.length <= 0) {
    throw new Error("orgId is not a valid id");
  }

  const results = useQuery(api.organizations.queries.list, {
    orgId: orgId as Id<"organizations">,
  });

  const isLoading = results === undefined;

  const orgs = results?.map(orgDocToOrgObject) ?? [];

  return { orgs, isLoading };
}
