"use client";

import { Button } from "@/components/ui/button";
import { formatDiscussionDate } from "@/lib/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export default function DiscussionHeader({
  discussionId,
  organizationId,
  meetingId,
}: {
  discussionId: string;
  organizationId: string;
  meetingId: string;
}) {
  const router = useRouter();

  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: organizationId as Id<"organizations">,
  });

  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  const startMeeting = useMutation(api.meetings.mutations.start);

  const isNextDiscussion =
    meetingDetails?.nextDiscussionId &&
    discussion?._id === meetingDetails.nextDiscussionId;

  const handleStart = async () => {
    if (!meetingId || !organizationId) return;

    const newDiscussionId = await startMeeting({
      meetingId: meetingId as Id<"meetings">,
      orgId: organizationId as Id<"organizations">,
    });

    router.push(`/a/${organizationId}/${meetingId}/${newDiscussionId}`);
  };

  return (
    <>
      <h1 className="text-6xl font-medium">
        {meetingDetails?.title ?? "Meeting"} -{" "}
        {formatDiscussionDate(discussion?.date)}
      </h1>
      <div>{meetingDetails?.owner?.name ?? "Unknown owner"}</div>
      {isNextDiscussion && (
        <Button className="mt-4" onClick={handleStart}>
          Start
        </Button>
      )}
    </>
  );
}
