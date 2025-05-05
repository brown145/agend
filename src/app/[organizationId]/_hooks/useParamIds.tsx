import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

/**
 * Returns the meetingId, organizationId, and discussionId from the URL params.
 * If the param is not present, it returns null for that value.
 */
export function useParamIds() {
  const {
    meetingId: meetingIdString,
    organizationId: organizationIdString,
    discussionId: discussionIdString,
  } = useParams();

  const meetingId = meetingIdString
    ? (meetingIdString as Id<"meetings">)
    : null;

  const organizationId = organizationIdString
    ? (organizationIdString as Id<"organizations">)
    : null;

  const discussionId = discussionIdString
    ? (discussionIdString as Id<"discussions">)
    : null;

  return { meetingId, organizationId, discussionId };
}
