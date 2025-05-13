"use client";

import { AddMeeting } from "../new/_components/AddMeeting"; // TODO: move this to components folder?

export default function AddMeetingClient({ orgId }: { orgId: string }) {
  const handleSubmit = (id: string) => {
    // TODO: toast
    console.log("submit", id);
  };

  return <AddMeeting orgId={orgId} onSubmit={handleSubmit} />;
}
