"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TaskList } from "./TaskList";

export const TopicList = () => {
  const topicList = useQuery(api.topics.list);
  return (
    <div>
      <AddTopic />
      <hr className="my-4" />
      {topicList?.map(({ _id, text, completed, metadata }) => (
        <div key={_id}>
          <Topic
            completed={completed ?? false}
            id={_id}
            tasksCompleted={metadata?.tasksCompleted ?? false}
            text={text}
          />
          <div className="ml-4">
            <TaskList topicId={_id} />
          </div>
        </div>
      ))}
      {topicList?.length === 0 && <div>No topics</div>}
    </div>
  );
};

const Topic = ({
  completed,
  id,
  tasksCompleted,
  text,
}: {
  completed: boolean;
  id: Id<"topics">;
  tasksCompleted: boolean;
  text: string;
}) => {
  const updateTopic = useMutation(api.topics.update);

  return (
    <div className="flex gap-2 items-center">
      <input
        checked={completed}
        onChange={() => updateTopic({ id, completed: !completed })}
        type="checkbox"
      />
      <div className={twMerge(completed && tasksCompleted && "line-through")}>
        {text}
      </div>
    </div>
  );
};

const AddTopic = () => {
  const [text, setText] = useState("");
  const createTopic = useMutation(api.topics.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTopic({ text });
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
        Add topic
      </button>
    </form>
  );
};
