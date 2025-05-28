"use client";

import { redirect, useParams } from "next/navigation";
import { AddMeeting } from "./_components/AddMeeting";

export default function MeetingsNewPage() {
  const { organizationId } = useParams();
  const currentOrgId = organizationId ? organizationId.toString() : null;

  const handleSubmit = (id: string) => {
    redirect(`/a/${organizationId}/${id}`);
  };

  if (!currentOrgId) {
    return null;
  }

  return (
    <div className="p-4">
      <AddMeeting onSubmit={handleSubmit} orgId={currentOrgId} />
    </div>
  );
}
