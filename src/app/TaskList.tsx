"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const TaskList = ({ topicId }: { topicId: Id<"topics"> }) => {
  const taskList = useQuery(api.tasks.listByTopic, { topicId });
  return (
    <main>
      {taskList?.map(({ _id, text, completed }) => (
        <Task key={_id} id={_id} text={text} completed={completed ?? false} />
      ))}
      {taskList?.length === 0 && <div>No tasks</div>}
      <AddTask topicId={topicId} />
    </main>
  );
};

const Task = ({
  id,
  text,
  completed,
}: {
  id: Id<"tasks">;
  text: string;
  completed: boolean;
}) => {
  const updateTask = useMutation(api.tasks.update);

  return (
    <div className="flex gap-2 items-center">
      <input
        checked={completed}
        onChange={() => updateTask({ id, completed: !completed })}
        type="checkbox"
      />
      {text}
    </div>
  );
};

const AddTask = ({ topicId }: { topicId: Id<"topics"> }) => {
  const [text, setText] = useState("");
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask({ topicId, text });
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
      <button className="bg-gray-500 text-white rounded-md p-1" type="submit">
        Add task
      </button>
    </form>
  );
};
