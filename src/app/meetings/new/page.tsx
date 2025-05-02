"use client";

import { redirect } from "next/navigation";
import { AddMeeting } from "../_components/AddMeeting";

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
