"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MeetingList from "./_components/MeetingList";

export default function MeetingsPage() {
  const { organizationId } = useParams();
  const currentOrgId = organizationId ? organizationId.toString() : null;

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <h1 className="text-6xl font-medium">Meetings</h1>
        <Link
          href={`/${organizationId}/new`}
          title="New meeting"
          className="pt-1 text-muted-foreground"
        >
          <PlusCircle className="h-4 w-4" />
        </Link>
      </div>
      {currentOrgId && (
        <div className="flex flex-col">
          <MeetingList orgId={currentOrgId} />
        </div>
      )}
    </div>
  );
}
