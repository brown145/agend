import { DateTime } from "luxon";

export const formatDiscussionDate = (
  date: string | null | "next" | undefined,
) => {
  if (date === "next") return "Next";
  if (!date) return "Unknown Date";
  try {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT);
  } catch {
    return "Unknown Date";
  }
};
