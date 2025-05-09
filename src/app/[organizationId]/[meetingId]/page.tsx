"use client";

import { useParamIds } from "../_hooks/useParamIds";
import { MeetingHeader } from "./_components/MeetingHeader";

export default function MeetingsPage() {
  const { meetingId, organizationId } = useParamIds();

  // const meeting = useQuery(
  //   api.meetings.queries.byMeetingId,
  //   meetingId && organizationId
  //     ? {
  //         meetingId,
  //         orgId: organizationId,
  //       }
  //     : "skip",
  // );

  // const discussions = useQuery(
  //   api.discussions.listByMeeting,
  //   meetingId && organizationId
  //     ? {
  //         meetingId,
  //         orgId: organizationId,
  //       }
  //     : "skip",
  // );

  // if (!meeting) {
  //   return <div>Meeting not found</div>;
  // }

  // TODO: handle loading state
  if (!meetingId || !organizationId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <MeetingHeader meetingId={meetingId} organizationId={organizationId} />
      {/* TODO: add back in */}
      {/* <div className="flex flex-col">
        {discussions?.map((discussion) => (
          <div key={discussion._id} className="hover:underline">
            <Link href={`/${organizationId}/${meetingId}/${discussion._id}`}>
              {formatDiscussionDate(discussion.date)}
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
