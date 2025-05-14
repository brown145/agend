"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

export default function DiscussionList({
  orgId,
  meetingId,
}: {
  orgId: string;
  meetingId: string;
}) {
  const router = useRouter();
  const discussions = useQuery(api.discussions.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });

  const nextDiscussion = discussions?.find(
    (discussion) => discussion.date === "next",
  );

  const pastDiscussions = discussions?.filter(
    (discussion) => discussion.date !== "next",
  );

  if (!pastDiscussions?.length) {
    return (
      <Alert>
        <HeartCrack className="h-4 w-4" />
        <AlertTitle>No discussions yet</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-2 w-full">
            <div>
              This meeting has no discussions yet. The history will be listed
              here once the first discussion is created.
            </div>
            {nextDiscussion && (
              <Button
                onClick={() =>
                  router.push(`/${orgId}/${meetingId}/${nextDiscussion._id}`)
                }
              >
                Start the discussion
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-background z-10 border-b">
        <TableRow>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pastDiscussions.map((discussion) => (
          <TableRow
            key={discussion._id}
            className="cursor-pointer"
            onClick={() =>
              router.push(`/${orgId}/${meetingId}/${discussion._id}`)
            }
          >
            <TableCell>
              <Link
                className="font-bold hover:underline"
                href={`/${orgId}/${meetingId}/${discussion._id}`}
              >
                {formatDiscussionDate(discussion.date)}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
