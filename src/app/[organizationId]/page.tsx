"use client";

import { Button } from "@/components/ui/button";
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
    <div className="h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button
          variant="link"
          size="sm"
          className="w-fit text-muted-foreground"
        >
          <Link
            className="p-0"
            href={`/${organizationId}/new`}
            title="New meeting"
          >
            <PlusCircle className="h-4 w-4" />
          </Link>
        </Button>
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

  const isOwnMeeting = currentUser?._id === meeting.owner;

  return (
    <div key={meeting._id} className="flex items-center gap-2">
      <Link className="font-bold" href={`/${meeting.orgId}/${meeting._id}`}>
        {meeting.title}
      </Link>
      {meeting.nextDiscussionId && (
        <Link
          className="text-muted-foreground italic"
          href={`/${meeting.orgId}/${meeting._id}/${meeting.nextDiscussionId}`}
        >
          Next
        </Link>
      )}
      <div className="text-muted-foreground italic">
        {isOwnMeeting ? "Yours" : owner?.name}
      </div>
    </div>
  );
};
