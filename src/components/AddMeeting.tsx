"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const AddMeeting = ({
  onSubmit,
}: {
  onSubmit: (id: string) => void;
}) => {
  const { organizationId } = useParams();
  const [title, setTitle] = useState("");
  const createMeeting = useMutation(api.meetings.create);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = await createMeeting({
      title,
      orgId: organizationId as Id<"organizations">,
    });
    onSubmit(id);
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
