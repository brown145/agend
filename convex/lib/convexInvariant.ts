import { ConvexError } from "convex/values";

export function convexInvariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new ConvexError(message);
  }
}
