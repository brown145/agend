"use client";

import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TaskList } from "./TaskList";

export const TopicList = ({
  discussionId,
  orgId,
  meetingId,
}: {
  discussionId: Id<"discussions">;
  orgId: Id<"organizations">;
  meetingId: Id<"meetings">;
}) => {
  const topicList = useQuery(api.topics.listByDiscussion, {
    discussionId,
    orgId,
  });
  return (
    <div className="flex flex-col gap-2">
      {topicList?.map(({ _id, text, completed, metadata }) => (
        <div
          key={_id}
          className="border-l-2 border-solid border-emerald-500 pl-2"
        >
          <Topic
            completed={completed ?? false}
            id={_id}
            orgId={orgId}
            tasksCompleted={metadata?.tasksCompleted ?? false}
            text={text}
          />
          <TaskList meetingId={meetingId} orgId={orgId} topicId={_id} />
        </div>
      ))}
      {topicList?.length === 0 && <div>No topics</div>}
      <AddTopic discussionId={discussionId} orgId={orgId} />
    </div>
  );
};

const Topic = ({
  completed,
  id,
  orgId,
  tasksCompleted,
  text,
}: {
  completed: boolean;
  id: Id<"topics">;
  orgId: Id<"organizations">;
  tasksCompleted: boolean;
  text: string;
}) => {
  const updateTopic = useMutation(api.topics.update);

  return (
    <div className="flex gap-2 items-center">
      <input
        checked={completed}
        onChange={() => updateTopic({ id, completed: !completed, orgId })}
        type="checkbox"
      />
      <div className={cn(completed && tasksCompleted && "line-through")}>
        {text}
      </div>
    </div>
  );
};

const AddTopic = ({
  discussionId,
  orgId,
}: {
  discussionId: Id<"discussions">;
  orgId: Id<"organizations">;
}) => {
  const [text, setText] = useState("");
  const createTopic = useMutation(api.topics.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTopic({ text, discussionId, orgId });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border-2 border-gray-300 rounded-md p-1"
        onChange={(e) => setText(e.target.value)}
        type="text"
        value={text}
      />
      <button
        className="bg-emerald-500 text-white rounded-md p-1"
        type="submit"
      >
        Add topic
      </button>
    </form>
  );
};
