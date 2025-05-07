"use client";

import { TopicList } from "@/components/TopicList";
import { formatDiscussionDate } from "@/lib/utils/date";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParamIds } from "../../_hooks/useParamIds";

export default function DiscussionPage() {
  const router = useRouter();
  const { meetingId, discussionId, organizationId } = useParamIds();
  const startMeeting = useMutation(api.meetings.start);

  const meeting = useQuery(
    api.meetings.details,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  );

  const discussion = useQuery(
    api.discussions.details,
    discussionId && organizationId
      ? {
          discussionId,
          orgId: organizationId,
        }
      : "skip",
  );

  const meetingOwner = useQuery(
    api.users.details,
    meeting?.owner && organizationId
      ? { userId: meeting.owner, orgId: organizationId }
      : "skip",
  );

  const isNextDiscussion =
    meeting?.nextDiscussionId && discussion?._id === meeting.nextDiscussionId;

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
    <div className="">
      <h1 className="text-2xl font-bold">
        {meeting?.title ?? "Meeting"} - {discussionDate}
      </h1>
      <div>{meetingOwner?.name ?? "Unknown owner"}</div>
      {isNextDiscussion && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleStart}
        >
          Start
        </button>
      )}
      {discussion?.previousDiscussionId && (
        <DiscussionRecap discussionId={discussion?.previousDiscussionId} />
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

const DiscussionRecap = ({
  discussionId,
}: {
  discussionId: Id<"discussions">;
}) => {
  const { organizationId } = useParamIds();
  const discussion = useQuery(
    api.discussions.details,
    discussionId && organizationId
      ? {
          discussionId,
          orgId: organizationId,
        }
      : "skip",
  );

  return (
    <div>
      <h2 className="text-lg font-bold">Review</h2>
      <div className="text-sm text-gray-500">
        From: {formatDiscussionDate(discussion?.date)}
        {organizationId && (
          <TopicList
            discussionId={discussionId}
            editable={false}
            orgId={organizationId}
          />
        )}
      </div>
    </div>
  );
};
