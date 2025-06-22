import { makeUseQueryWithStatus } from "convex-helpers/react";
import { useQueries as useQueriesWithCache } from "convex-helpers/react/cache/hooks";
import {
  OptionalRestArgsOrSkip,
  useConvexAuth,
  useMutation,
  useQueries,
} from "convex/react";
import { FunctionReference } from "convex/server";

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);
export const useQueryWithStatusAndCache =
  makeUseQueryWithStatus(useQueriesWithCache);

/**
 * A wrapper around `useQueryWithStatus` that is authenticated.
 *
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: OptionalRestArgsOrSkip<Query>[0] | "skip",
) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return useQueryWithStatus(
    query,
    isLoading || isAuthenticated ? args : "skip",
  );
}

/**
 * A wrapper around `useQueryWithStatus` that is cached and authenticated.
 *
 * If the user is not authenticated, the query is skipped. Caching is provided
 * by the `ConvexQueryCacheProvider`.
 */
export function useAuthedQueryWithCache<
  Query extends FunctionReference<"query">,
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | "skip") {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return useQueryWithStatusAndCache(
    query,
    isLoading || isAuthenticated ? args : "skip",
  );
}

/**
 * A wrapper around useMutation that automatically checks authentication state.
 * If the user is not authenticated, the mutation is not sent, and the
 * returned promise is rejected.
 */
export function useAuthedMutation<
  Mutation extends FunctionReference<"mutation">,
>(mutation: Mutation) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const originalMutation = useMutation(mutation);

  return (
    ...args: Parameters<typeof originalMutation>
  ): ReturnType<typeof originalMutation> => {
    if (isLoading || isAuthenticated) {
      return originalMutation(...args);
    } else {
      return Promise.reject(new Error("User not authenticated"));
    }
  };
}
