"use client";

import { formatDiscussionDate } from "@/lib/utils/date";
import { useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useParamIds } from "./_hooks/useParamIds";

export default function MeetingsPage() {
  const { organizationId } = useParamIds();
  const meetings =
    useQuery(
      api.meetings.list,
      organizationId
        ? {
            orgId: organizationId,
          }
        : "skip",
    ) ?? [];

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <h1 className="text-6xl font-medium">Meetings</h1>
        <Link
          href={`/${organizationId}/new`}
          title="New meeting"
          className="pt-1 text-muted-foreground"
        >
          <PlusCircle className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-col">
        <MeetingList meetings={meetings} />
      </div>
    </div>
  );
}

const MeetingList = ({ meetings }: { meetings: Doc<"meetings">[] }) => {
  return (
    <div className="flex flex-col">
      {meetings.map((meeting) => (
        <MeetingListItem key={meeting._id} meeting={meeting} />
      ))}
    </div>
  );
};

const MeetingListItem = ({ meeting }: { meeting: Doc<"meetings"> }) => {
  const currentUser = useQuery(api.users.currentUser, {
    orgId: meeting.orgId,
  });

  const owner = useQuery(api.users.details, {
    userId: meeting.owner,
    orgId: meeting.orgId,
  });

  const discussions =
    useQuery(api.discussions.listByMeeting, {
      meetingId: meeting._id,
      orgId: meeting.orgId,
    }) ?? [];

  const mostRecentDiscussion = discussions
    .filter(
      (d): d is typeof d & { date: string } =>
        d.date !== "next" && d.date !== null,
    )
    .sort((a, b) => {
      return b.date.localeCompare(a.date);
    })[0];

  const isOwnMeeting = currentUser?._id === meeting.owner;

  return (
    <div key={meeting._id} className="flex items-start gap-2">
      <Link className="font-bold" href={`/${meeting.orgId}/${meeting._id}`}>
        {meeting.title}
      </Link>
      <div>({isOwnMeeting ? "Yours" : owner?.name})</div>
      {meeting.nextDiscussionId && (
        <Link
          className="text-muted-foreground italic"
          href={`/${meeting.orgId}/${meeting._id}/${meeting.nextDiscussionId}`}
        >
          Next
        </Link>
      )}
      {mostRecentDiscussion ? (
        <Link
          className="text-muted-foreground italic"
          href={`/${meeting.orgId}/${meeting._id}/${mostRecentDiscussion._id}`}
        >
          {formatDiscussionDate(mostRecentDiscussion.date)}
        </Link>
      ) : (
        <div className="text-muted-foreground italic"></div>
      )}
    </div>
  );
};
