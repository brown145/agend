import React from "react";
import { MeetingList } from "./_components/MeetingList";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-1">
      <MeetingList />
      <div className="flex-1">{children}</div>
    </div>
  );
}
