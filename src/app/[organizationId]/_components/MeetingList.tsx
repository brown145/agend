import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function MeetingList({ orgId }: { orgId: string }) {
  const meetings = useQuery(api.meetings.queries.list, {
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex flex-col">
      {meetings?.map((meeting) => (
        <MeetingListItem
          key={meeting._id}
          meetingId={meeting._id}
          orgId={orgId}
        />
      ))}
    </div>
  );
}

function MeetingListItem({
  meetingId,
  orgId,
}: {
  meetingId: string;
  orgId: string;
}) {
  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex items-start gap-2">
      <Link className="font-bold" href={`/${orgId}/${meetingId}`}>
        {meetingDetails?.title}
      </Link>
      <div>
        ({meetingDetails?.isYours ? "Yours" : meetingDetails?.owner?.name})
      </div>
      {meetingDetails?.nextDiscussionId && (
        <Link
          className="text-muted-foreground italic"
          href={`/${orgId}/${meetingId}/${meetingDetails?.nextDiscussionId}`}
        >
          Next
        </Link>
      )}
      {meetingDetails?.previousDiscussion ? (
        <Link
          className="text-muted-foreground italic"
          href={`/${orgId}/${meetingId}/${meetingDetails?.previousDiscussion?._id}`}
        >
          {formatDiscussionDate(meetingDetails?.previousDiscussion?.date)}
        </Link>
      ) : (
        <div className="text-muted-foreground italic"></div>
      )}
    </div>
  );
}
