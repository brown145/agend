"use client";

import { TopicList } from "@/components/TopicList";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function DiscussionPage() {
  const params = useParams();
  const meetingId = params.meetingId as Id<"meetings">;
  const discussionId = params.discussionId as Id<"discussions">;

  const meeting = useQuery(
    api.meetings.details,
    meetingId
      ? {
          meetingId,
        }
      : "skip",
  );

  const discussion = useQuery(
    api.discussions.details,
    discussionId
      ? {
          discussionId,
        }
      : "skip",
  );

  const discussionDate = discussion?._creationTime
    ? new Date(discussion._creationTime)
    : null;

  return (
    <div className="">
      <h1 className="text-2xl font-bold">
        {meeting?.title ?? "Meeting"} -{" "}
        {discussionDate ? discussionDate.toLocaleDateString() : "Unknown"}
      </h1>
      <h2 className="text-lg font-bold">Recap (previous discussion date)</h2>
      <div className="text-sm text-gray-500">TODO</div>
      <h2 className="text-lg font-bold">Topics</h2>
      <div className="">
        <TopicList discussionId={discussionId} meetingId={meetingId} />
      </div>
      <h2 className="text-lg font-bold">Summary</h2>
      <div className="text-sm text-gray-500">TODO</div>
    </div>
  );
}
