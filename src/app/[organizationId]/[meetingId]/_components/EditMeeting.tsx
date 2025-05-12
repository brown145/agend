"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export const EditMeeting = ({
  orgId,
  meetingId,
  onCancel,
}: {
  orgId: string;
  meetingId: string;
  onCancel: () => void;
}) => {
  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId: meetingId as Id<"meetings">,
    orgId: orgId as Id<"organizations">,
  });
  const updateMeeting = useMutation(api.meetings.mutations.update);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get("title") as string;
    await updateMeeting({
      meetingId: meetingId as Id<"meetings">,
      orgId: orgId as Id<"organizations">,
      title: newTitle,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        name="title"
        defaultValue={meetingDetails?.title}
        autoFocus
        className="!text-6xl font-medium h-auto p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
      />
      <div className="flex gap-2">
        <Button type="submit" variant="default">
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
