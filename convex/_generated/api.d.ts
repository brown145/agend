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
import type * as discussions from "../discussions.js";
import type * as meetingAttendance from "../meetingAttendance.js";
import type * as meetings from "../meetings.js";
import type * as organizations from "../organizations.js";
import type * as tasks from "../tasks.js";
import type * as topics from "../topics.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  discussions: typeof discussions;
  meetingAttendance: typeof meetingAttendance;
  meetings: typeof meetings;
  organizations: typeof organizations;
  tasks: typeof tasks;
  topics: typeof topics;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
