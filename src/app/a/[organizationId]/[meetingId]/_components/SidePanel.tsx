"use client";

import { AttendeesList } from "./AttendeeList";

export default function SidePanel() {
  return (
    <div className="relative flex w-[260px]">
      <div className="border-l border-gray-200 h-full w-full p-4">
        <div className="font-semibold">Attendees</div>
        <div>
          <AttendeesList />
        </div>
      </div>
    </div>
  );
}
