import SidePanel from "@/app/a/[organizationId]/[meetingId]/_components/SidePanel";
import React from "react";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-full">
      <div className="flex-1 h-full p-4">{children}</div>
      <SidePanel />
    </div>
  );
}
