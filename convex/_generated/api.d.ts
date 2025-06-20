/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as devOnly_mutations from "../devOnly/mutations.js";
import type * as discussions_mutations from "../discussions/mutations.js";
import type * as discussions_queries from "../discussions/queries.js";
import type * as lib_authedMutation from "../lib/authedMutation.js";
import type * as lib_authedOrgMutation from "../lib/authedOrgMutation.js";
import type * as lib_authedOrgQuery from "../lib/authedOrgQuery.js";
import type * as lib_authedQuery from "../lib/authedQuery.js";
import type * as lib_convexInvariant from "../lib/convexInvariant.js";
import type * as lib_functions from "../lib/functions.js";
import type * as lib_triggers from "../lib/triggers.js";
import type * as lib_validateIdentity from "../lib/validateIdentity.js";
import type * as meetings_mutations from "../meetings/mutations.js";
import type * as meetings_queries from "../meetings/queries.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as tasks_mutations from "../tasks/mutations.js";
import type * as tasks_queries from "../tasks/queries.js";
import type * as topics_mutations from "../topics/mutations.js";
import type * as topics_queries from "../topics/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "devOnly/mutations": typeof devOnly_mutations;
  "discussions/mutations": typeof discussions_mutations;
  "discussions/queries": typeof discussions_queries;
  "lib/authedMutation": typeof lib_authedMutation;
  "lib/authedOrgMutation": typeof lib_authedOrgMutation;
  "lib/authedOrgQuery": typeof lib_authedOrgQuery;
  "lib/authedQuery": typeof lib_authedQuery;
  "lib/convexInvariant": typeof lib_convexInvariant;
  "lib/functions": typeof lib_functions;
  "lib/triggers": typeof lib_triggers;
  "lib/validateIdentity": typeof lib_validateIdentity;
  "meetings/mutations": typeof meetings_mutations;
  "meetings/queries": typeof meetings_queries;
  "organizations/queries": typeof organizations_queries;
  "tasks/mutations": typeof tasks_mutations;
  "tasks/queries": typeof tasks_queries;
  "topics/mutations": typeof topics_mutations;
  "topics/queries": typeof topics_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
