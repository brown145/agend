"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const TaskList = () => {
  const taskList = useQuery(api.tasks.list);
  return (
    <main>
      {taskList?.map(({ _id, text, completed }) => (
        <Task key={_id} id={_id} text={text} completed={completed ?? false} />
      ))}
      {taskList?.length === 0 && <div>No tasks</div>}
      <AddTask />
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
        type="checkbox"
        checked={completed}
        onChange={() => updateTask({ id, completed: !completed })}
      />
      {text}
    </div>
  );
};

const AddTask = () => {
  const [text, setText] = useState("");
  const createTask = useMutation(api.tasks.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask({ text });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        className="border-2 border-gray-300 rounded-md p-1"
        onChange={(e) => setText(e.target.value)}
      />
      <button className="bg-gray-500 text-white rounded-md p-1" type="submit">
        Add
      </button>
    </form>
  );
};
