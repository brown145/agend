/* eslint-disable no-restricted-imports */
import {
  internalMutation as rawInternalMutation,
  mutation as rawMutation,
} from "../_generated/server";
/* eslint-enable no-restricted-imports */
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { triggers } from "./triggers";

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
