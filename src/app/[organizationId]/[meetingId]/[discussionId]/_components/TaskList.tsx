"use client";

import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export const TaskList = ({
  orgId,
  editable,
  topicId,
}: {
  orgId: string;
  editable?: boolean;
  topicId: string;
}) => {
  const taskList = useQuery(api.tasks.queries.byTopicId, {
    topicId: topicId as Id<"topics">,
    orgId: orgId as Id<"organizations">,
  });
  return (
    <main>
      {taskList?.map((task) => (
        <div
          key={task._id}
          className="border-l-2 border-solid border-emerald-300 pl-2"
        >
          <Task task={task} orgId={orgId} />
        </div>
      ))}
      {editable && taskList?.length === 0 && <div>No tasks</div>}
      {editable && <AddTask orgId={orgId} topicId={topicId} />}
    </main>
  );
};

const Task = ({ task, orgId }: { task: Doc<"tasks">; orgId: string }) => {
  const updateTask = useMutation(api.tasks.mutations.complete);
  const owner = useQuery(api.users.queries.byUserId, {
    userId: task.owner,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex gap-2 items-center text-sm">
      <input
        checked={task.completed}
        onChange={() =>
          updateTask({
            taskId: task._id,
            isCompleted: !task.completed,
            orgId: orgId as Id<"organizations">,
          })
        }
        type="checkbox"
      />
      {task.text}
      <div className="text-muted-foreground">{owner?.name}</div>
    </div>
  );
};

const AddTask = ({ orgId, topicId }: { orgId: string; topicId: string }) => {
  const [text, setText] = useState("");
  const createTask = useMutation(api.tasks.mutations.create);

  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const select = form.querySelector("select") as HTMLSelectElement;
    const owner = select.value as Id<"users">;
    createTask({
      topicId: topicId as Id<"topics">,
      text,
      orgId: orgId as Id<"organizations">,
      owner,
    });
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
      <select className="border-2 border-gray-300 rounded-md p-1 text-sm">
        {orgUsers?.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className="bg-emerald-300 text-white rounded-md p-1 text-sm"
        type="submit"
      >
        Add task
      </button>
    </form>
  );
};
