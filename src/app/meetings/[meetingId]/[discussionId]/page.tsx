"use client";

import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function DiscussionPage() {
  const params = useParams();
  const meetingId = params.meetingId as Id<"meetings">;
  const discussionId = params.discussionId as Id<"discussions">;

  return (
    <div className="">
      <div>meetingId: {meetingId}</div>
      <div>discussionId: {discussionId}</div>
    </div>
  );
}
