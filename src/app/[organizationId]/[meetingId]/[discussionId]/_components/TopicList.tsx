"use client";

import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { TaskList } from "./TaskList";

export const TopicList = ({
  discussionId,
  editable = true,
  orgId,
}: {
  discussionId: string;
  editable?: boolean;
  orgId: string;
}) => {
  const topicList = useQuery(api.topics.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex flex-col gap-2">
      {topicList?.map((topic) => (
        <div
          key={topic._id}
          className="border-l-2 border-solid border-emerald-500 pl-2"
        >
          <Topic topic={topic} orgId={orgId} />
          <TaskList orgId={orgId} topicId={topic._id} editable={editable} />
        </div>
      ))}
      {editable && topicList?.length === 0 && <div>No topics</div>}
      {editable && <AddTopic discussionId={discussionId} orgId={orgId} />}
    </div>
  );
};

// TODO: use topicID to query for topic details
const Topic = ({ topic, orgId }: { topic: Doc<"topics">; orgId: string }) => {
  const updateTopic = useMutation(api.topics.mutations.complete);
  const owner = useQuery(api.users.queries.byUserId, {
    userId: topic.owner,
    orgId: orgId as Id<"organizations">,
  });

  return (
    <div className="flex gap-2 items-center">
      <input
        checked={topic.completed}
        onChange={() =>
          updateTopic({
            topicId: topic._id,
            isCompleted: !topic.completed,
            orgId: orgId as Id<"organizations">,
          })
        }
        type="checkbox"
      />
      <div
      // TODO:
      // className={cn(
      //   topic.completed &&
      //     (topic.metadata?.tasksCompleted ?? false) &&
      //     "line-through",
      // )}
      >
        {topic.text}
      </div>
      <div className="text-muted-foreground">{owner?.name}</div>
    </div>
  );
};

const AddTopic = ({
  discussionId,
  orgId,
}: {
  discussionId: string;
  orgId: string;
}) => {
  const [text, setText] = useState("");
  const createTopic = useMutation(api.topics.mutations.create);

  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const select = form.querySelector("select") as HTMLSelectElement;
    const owner = select.value as Id<"users">;
    createTopic({
      text,
      discussionId: discussionId as Id<"discussions">,
      orgId: orgId as Id<"organizations">,
      owner,
    });
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
      <select className="border-2 border-gray-300 rounded-md p-1">
        {orgUsers?.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className="bg-emerald-500 text-white rounded-md p-1"
        type="submit"
      >
        Add topic
      </button>
    </form>
  );
};
