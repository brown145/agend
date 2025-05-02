"use client";

import { AddMeeting } from "@/components/AddMeeting";
import { redirect } from "next/navigation";

export default function MeetingsNewPage() {
  const handleSubmit = (id: string) => {
    redirect(`/meetings/${id}`);
  };

  return (
    <div>
      <AddMeeting onSubmit={handleSubmit} />
    </div>
  );
}
