"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export const AddMeeting = ({
  onSubmit,
  orgId,
}: {
  onSubmit: (id: string) => void;
  orgId: string;
}) => {
  const [title, setTitle] = useState("");
  const createMeeting = useMutation(api.meetings.mutations.create);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = await createMeeting({
      title,
      orgId: orgId as Id<"organizations">,
    });
    onSubmit(id);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        className="!text-6xl font-medium h-auto p-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New meeting title"
        value={title}
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="submit" variant="default">
          Save
        </Button>
      </div>
    </form>
  );
};
