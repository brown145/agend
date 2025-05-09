"use client";

import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useParamIds } from "../../_hooks/useParamIds";
import DiscussionRecap from "./_components/DiscussionRecap";
import { TopicList } from "./_components/TopicList";

export default function DiscussionPage() {
  const router = useRouter();
  const { meetingId, discussionId, organizationId } = useParamIds();
  const startMeeting = useMutation(api.meetings.mutations.start);

  const meetingDetails = useQuery(
    api.meetings.queries.byMeetingId,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  );

  const discussion = useQuery(
    api.discussions.queries.byDiscussionId,
    discussionId && organizationId
      ? {
          discussionId,
          orgId: organizationId,
        }
      : "skip",
  );

  const isNextDiscussion =
    meetingDetails?.nextDiscussionId &&
    discussion?._id === meetingDetails.nextDiscussionId;

  const handleStart = async () => {
    if (!meetingId || !organizationId) return;
    const newDiscussionId = await startMeeting({
      meetingId,
      orgId: organizationId,
    });
    // Redirect to the new discussion page
    router.push(`/${organizationId}/${meetingId}/${newDiscussionId}`);
  };

  const discussionDate = formatDiscussionDate(discussion?.date);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-6xl font-medium">
        {meetingDetails?.title ?? "Meeting"} - {discussionDate}
      </h1>
      <div>{meetingDetails?.owner?.name ?? "Unknown owner"}</div>
      {isNextDiscussion && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleStart}
        >
          Start
        </button>
      )}
      {discussion?.previousDiscussionId && organizationId && (
        <DiscussionRecap
          discussionId={discussion?.previousDiscussionId}
          organizationId={organizationId}
        />
      )}
      <h2 className="text-lg font-bold">Topics</h2>
      <div className="">
        {discussionId && organizationId && (
          <TopicList discussionId={discussionId} orgId={organizationId} />
        )}
      </div>
      {!isNextDiscussion && discussionId && organizationId && (
        <>
          <h2 className="text-lg font-bold">Summary</h2>
          <TopicList
            discussionId={discussionId}
            editable={false}
            orgId={organizationId}
          />
        </>
      )}
    </div>
  );
}
