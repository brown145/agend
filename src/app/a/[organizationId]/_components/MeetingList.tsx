"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { HeartCrack } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MeetingList({ orgId }: { orgId: string }) {
  const meetings = useQuery(api.meetings.queries.list, {
    orgId: orgId as Id<"organizations">,
  });

  if (meetings?.length === 0) {
    return (
      <Alert>
        <HeartCrack className="h-4 w-4" />
        <AlertTitle>No meetings yet</AlertTitle>
        <AlertDescription>
          <div>
            You can create a meeting by clicking the input below, or on the{" "}
            <Link href={`/${orgId}/new`} className="underline">
              new meeting
            </Link>{" "}
            page.
          </div>
        </AlertDescription>
      </Alert>
    );
  }
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
      onClick={() => router.push(`/a/${orgId}/${meetingId}`)}
    >
      <TableCell>
        <Link
          className="font-bold hover:underline"
          href={`/a/${orgId}/${meetingId}`}
        >
          {meetingDetails?.title}
        </Link>
      </TableCell>
      <TableCell>
        {meetingDetails?.nextDiscussionId && (
          <Link
            className="text-muted-foreground hover:underline"
            href={`/a/${orgId}/${meetingId}/${meetingDetails?.nextDiscussionId}`}
          >
            Next
          </Link>
        )}
      </TableCell>
      <TableCell>
        {meetingDetails?.previousDiscussion ? (
          <Link
            className="text-muted-foreground hover:underline"
            href={`/a/${orgId}/${meetingId}/${meetingDetails?.previousDiscussion?._id}`}
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
