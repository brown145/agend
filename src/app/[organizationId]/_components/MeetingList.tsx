"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MeetingList({ orgId }: { orgId: string }) {
  const meetings = useQuery(api.meetings.queries.list, {
    orgId: orgId as Id<"organizations">,
  });

  return (
    <Table>
      <TableHeader className="bg-background z-10 border-b">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Next</TableHead>
          <TableHead>Previous</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meetings?.map((meeting) => (
          <MeetingListItem
            key={meeting._id}
            meetingId={meeting._id}
            orgId={orgId}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function MeetingListItem({
  meetingId,
  orgId,
}: {
  meetingId: string;
  orgId: string;
}) {
  const router = useRouter();

  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/${orgId}/${meetingId}`)}
    >
      <TableCell>
        <Link
          className="font-bold hover:underline"
          href={`/${orgId}/${meetingId}`}
        >
          {meetingDetails?.title}
        </Link>
      </TableCell>
      <TableCell>
        {meetingDetails?.nextDiscussionId && (
          <Link
            className="text-muted-foreground hover:underline"
            href={`/${orgId}/${meetingId}/${meetingDetails?.nextDiscussionId}`}
          >
            Next
          </Link>
        )}
      </TableCell>
      <TableCell>
        {meetingDetails?.previousDiscussion ? (
          <Link
            className="text-muted-foreground hover:underline"
            href={`/${orgId}/${meetingId}/${meetingDetails?.previousDiscussion?._id}`}
          >
            {formatDiscussionDate(meetingDetails?.previousDiscussion?.date)}
          </Link>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>{meetingDetails?.owner?.name}</TableCell>
    </TableRow>
  );
}
