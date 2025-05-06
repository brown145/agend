"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const TaskList = ({
  orgId,
  topicId,
}: {
  orgId: Id<"organizations">;
  topicId: Id<"topics">;
}) => {
  const taskList = useQuery(api.tasks.listByTopic, {
    topicId,
    orgId,
  });
  return (
    <main>
      {taskList?.map(({ _id, text, completed }) => (
        <div
          key={_id}
          className="border-l-2 border-solid border-emerald-300 pl-2"
        >
          <Task
            completed={completed ?? false}
            id={_id}
            orgId={orgId}
            text={text}
          />
        </div>
      ))}
      {taskList?.length === 0 && <div>No tasks</div>}
      <AddTask orgId={orgId} topicId={topicId} />
    </main>
  );
};

const Task = ({
  completed,
  id,
  orgId,
  text,
}: {
  completed: boolean;
  id: Id<"tasks">;
  orgId: Id<"organizations">;
  text: string;
}) => {
  const updateTask = useMutation(api.tasks.update);

  return (
    <div className="flex gap-2 items-center text-sm">
      <input
        checked={completed}
        onChange={() => updateTask({ id, completed: !completed, orgId })}
        type="checkbox"
      />
      {text}
    </div>
  );
};

const AddTask = ({
  orgId,
  topicId,
}: {
  orgId: Id<"organizations">;
  topicId: Id<"topics">;
}) => {
  const [text, setText] = useState("");
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask({ topicId, text, orgId });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border-2 border-gray-300 rounded-md p-1 text-sm"
        onChange={(e) => setText(e.target.value)}
        type="text"
        value={text}
      />
      <button
        className="bg-emerald-300 text-white rounded-md p-1 text-sm"
        type="submit"
      >
        Add task
      </button>
    </form>
  );
};
