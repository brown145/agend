"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";

export const MeetingList = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1">Meetings</div>
      <Authenticated>
        <MeetingListAuthenticated />
      </Authenticated>
      <Unauthenticated>
        <MeetingListUnauthenticated />
      </Unauthenticated>
    </div>
  );
};

const MeetingListAuthenticated = () => {
  const meetingList = useQuery(api.meetings.list);

  return (
    <div className="flex flex-col gap-2">
      {meetingList?.map((meeting) => (
        <Link key={meeting._id} href={`/meetings/${meeting._id}`}>
          {meeting.title}
        </Link>
      ))}
    </div>
  );
};

const MeetingListUnauthenticated = () => {
  return <div>MeetingListUnauthenticated</div>;
};
