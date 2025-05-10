"use client";

import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function DiscussionList({
  orgId,
  meetingId,
}: {
  orgId: string;
  meetingId: string;
}) {
  const discussions = useQuery(api.discussions.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex flex-col">
      {discussions?.map((discussion) => (
        <div key={discussion._id} className="hover:underline">
          <Link href={`/${orgId}/${meetingId}/${discussion._id}`}>
            {formatDiscussionDate(discussion.date)}
          </Link>
        </div>
      ))}
    </div>
  );
}
