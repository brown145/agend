"use client";

import { AddMeeting } from "@/components/AddMeeting";
import { redirect } from "next/navigation";
import { useParamIds } from "../_hooks/useParamIds";

export default function MeetingsNewPage() {
  const { organizationId } = useParamIds();

  const handleSubmit = (id: string) => {
    redirect(`/${organizationId}/${id}`);
  };

  return (
    <div>
      <AddMeeting onSubmit={handleSubmit} />
    </div>
  );
}
