"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function MeetingsHeader({ orgId }: { orgId: string }) {
  return (
    <div className="flex items-start gap-2">
      <h1 className="text-6xl font-medium">Meetings</h1>
      <Link
        href={`/${orgId}/new`}
        title="New meeting"
        className="pt-1 text-muted-foreground"
      >
        <PlusCircle className="h-4 w-4" />
      </Link>
    </div>
  );
}
