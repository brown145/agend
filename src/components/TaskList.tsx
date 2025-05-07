"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export const TaskList = ({
  orgId,
  editable,
  topicId,
}: {
  orgId: Id<"organizations">;
  editable?: boolean;
  topicId: Id<"topics">;
}) => {
  const taskList = useQuery(api.tasks.listByTopic, {
    topicId,
    orgId,
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

const Task = ({
  task,
  orgId,
}: {
  task: Doc<"tasks">;
  orgId: Id<"organizations">;
}) => {
  const updateTask = useMutation(api.tasks.update);
  const owner = useQuery(api.users.details, {
    userId: task.owner,
    orgId,
  });

  return (
    <div className="flex gap-2 items-center text-sm">
      <input
        checked={task.completed}
        onChange={() =>
          updateTask({ id: task._id, completed: !task.completed, orgId })
        }
        type="checkbox"
      />
      {task.text}
      <div className="text-muted-foreground">{owner?.name}</div>
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

  const orgUsers = useQuery(api.users.listUsersInOrganization, {
    orgId,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const select = form.querySelector("select") as HTMLSelectElement;
    const owner = select.value as Id<"users">;
    createTask({ topicId, text, orgId, owner });
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
