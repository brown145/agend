"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { AttendenceList } from "./AttendenceList";

export const MeetingDetails = ({
  id,
  title,
}: {
  id: Id<"meetings">;
  title: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateMeeting = useMutation(api.meetings.update);
  const canEdit = useQuery(api.meetings.canEdit, { meetingId: id });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get("title") as string;
    await updateMeeting({ id, title: newTitle });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="title"
            defaultValue={title}
            className="border-2 border-gray-300 rounded-md p-1"
            autoFocus
          />
          <button
            type="submit"
            className="bg-emerald-800 text-white rounded-md px-2 py-1 text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white rounded-md px-2 py-1 text-sm"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Attendees</div>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="text-xl font-semibold">{title}</div>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Edit
          </button>
        )}
      </div>
      <AttendenceList meetingId={id} />
    </div>
  );
};
