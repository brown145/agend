import { AttendeesList } from "@/app/[organizationId]/[meetingId]/_components/AttendeeList";
import React from "react";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full">
      <div className="flex-1 h-full p-4">{children}</div>
      <div className="w-[300px] border-l border-gray-200 p-4 h-full">
        <div className="font-semibold">Attendees</div>
        <div>
          <AttendeesList />
        </div>
      </div>
    </div>
  );
}
