"use client";

import { AddMeeting } from "@/components/AddMeeting";
import { redirect, useParams } from "next/navigation";

export default function MeetingsNewPage() {
  const { organizationId } = useParams();

  const handleSubmit = (id: string) => {
    redirect(`/${organizationId}/${id}`);
  };

  return (
    <div>
      <AddMeeting onSubmit={handleSubmit} />
    </div>
  );
}
