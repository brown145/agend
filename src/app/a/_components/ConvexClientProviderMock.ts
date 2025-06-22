// adapted from https://github.com/get-convex/convex-helpers/blob/main/src/fakeConvexClient/fakeConvexClient.js

import {
  ConvexReactClient,
  MutationOptions,
  WatchQueryOptions,
} from "convex/react";
import {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
  getFunctionName,
} from "convex/server";

type QueryFunction = (args: Record<string, unknown>) => unknown;
type MutationFunction = (args: Record<string, unknown>) => Promise<unknown>;
type ActionFunction = (args: Record<string, unknown>) => Promise<unknown>;

export class ConvexClientProviderMock extends ConvexReactClient {
  private queries: Record<string, QueryFunction>;
  private mutations: Record<string, MutationFunction>;
  private actions: Record<string, ActionFunction>;

  constructor() {
    super("https://mock-1234.convex.cloud");
    this.queries = {};
    this.mutations = {};
    this.actions = {};
  }

  registerQueryFake<FuncRef extends FunctionReference<"query", "public">>(
    funcRef: FuncRef,
    impl: (args: FuncRef["_args"]) => FuncRef["_returnType"] | undefined,
  ): void {
    this.queries[getFunctionName(funcRef)] = impl;
  }

  registerMutationFake<FuncRef extends FunctionReference<"mutation", "public">>(
    funcRef: FuncRef,
    impl: (args: FuncRef["_args"]) => FuncRef["_returnType"],
  ): void {
    this.mutations[getFunctionName(funcRef)] = impl;
  }

  watchQuery<Query extends FunctionReference<"query">>(
    query: Query,
    ...argsAndOptions: [args?: FunctionArgs<Query>, options?: WatchQueryOptions]
  ) {
    const name = getFunctionName(query);
    const args = argsAndOptions[0] ?? {};
    return {
      localQueryResult: () => {
        const queryFn = this.queries[name];
        if (queryFn) {
          return queryFn(args);
        }
        throw new Error(
          `Unexpected query: ${name}. Try providing a function for this query in the mock client constructor.`,
        );
      },
      onUpdate: () => () => ({
        unsubscribe: () => null,
      }),
      journal: () => "",
    };
  }

  mutation<Mutation extends FunctionReference<"mutation">>(
    mutation: Mutation,
    ...argsAndOptions: [
      args?: FunctionArgs<Mutation>,
      options?: MutationOptions<FunctionArgs<Mutation>>,
    ]
  ): Promise<FunctionReturnType<Mutation>> {
    const name = getFunctionName(mutation);
    const args = argsAndOptions[0] ?? {};
    const mutationFn = this.mutations[name];
    if (mutationFn) {
      return mutationFn(args) as Promise<FunctionReturnType<Mutation>>;
    }
    throw new Error(
      `Unexpected mutation: ${name}. Try providing a function for this mutation in the mock client constructor.`,
    );
  }

  action<Action extends FunctionReference<"action">>(
    action: Action,
    ...args: [args?: FunctionArgs<Action>]
  ): Promise<FunctionReturnType<Action>> {
    const name = getFunctionName(action);
    const actionArgs = args[0] ?? {};
    const actionFn = this.actions[name];
    if (actionFn) {
      return actionFn(actionArgs) as Promise<FunctionReturnType<Action>>;
    }
    throw new Error(
      `Unexpected action: ${name}. Try providing a function for this action in the mock client constructor.`,
    );
  }

  setAuth() {
    // We don't need to do anything here.
    return Promise.resolve();
  }

  clearAuth() {
    // We don't need to do anything here.
  }

  connectionState() {
    return {
      hasInflightRequests: false,
      isWebSocketConnected: true,
      timeOfOldestInflightRequest: null,
      hasEverConnected: true,
      connectionCount: 1,
      connectionRetries: 0,
      lastError: null,
      lastErrorTime: null,
      inflightMutations: 0,
      inflightActions: 0,
    };
  }
}
