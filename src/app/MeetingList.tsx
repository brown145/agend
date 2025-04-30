"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DiscussionList } from "./DiscussionList";

export const MeetingList = () => {
  const meetingList = useQuery(api.meetings.list);
  return (
    <div className="flex flex-col gap-4">
      {meetingList?.map(({ _id, title }) => (
        <div
          key={_id}
          className="border-l-4 border-solid border-emerald-800 pl-2"
        >
          <Meeting id={_id} title={title} />
          <DiscussionList meetingId={_id} />
        </div>
      ))}
      {meetingList?.length === 0 && <div>No meetings</div>}
      <AddMeeting />
    </div>
  );
};

const Meeting = ({ id, title }: { id: Id<"meetings">; title: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateMeeting = useMutation(api.meetings.update);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get("title") as string;
    await updateMeeting({ id, title: newTitle });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex gap-2 items-center">
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
      </form>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="text-xl font-semibold">{title}</div>
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Edit
      </button>
    </div>
  );
};

const AddMeeting = () => {
  const [title, setTitle] = useState("");
  const createMeeting = useMutation(api.meetings.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMeeting({ title });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border-2 border-gray-300 rounded-md p-1"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New meeting title"
        type="text"
        value={title}
      />
      <button
        className="bg-emerald-800 text-white rounded-md p-1"
        type="submit"
      >
        New Meeting
      </button>
    </form>
  );
};
