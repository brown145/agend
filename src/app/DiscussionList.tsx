"use client";

import { useMutation, useQuery } from "convex/react";
import { twMerge } from "tailwind-merge";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TopicList } from "./TopicList";

interface DiscussionListProps {
  meetingId: Id<"meetings">;
}

export const DiscussionList = ({ meetingId }: DiscussionListProps) => {
  const discussionList = useQuery(api.discussions.listByMeeting, { meetingId });
  return (
    <div className="flex flex-col gap-2">
      {discussionList?.map(({ _id, createdAt, completed, metadata }) => (
        <div
          key={_id}
          className="border-l-2 border-solid border-emerald-700 pl-2"
        >
          <Discussion
            id={_id}
            createdAt={createdAt}
            completed={completed}
            topicsCompleted={metadata.topicsCompleted}
          />
          <TopicList discussionId={_id} meetingId={meetingId} />
        </div>
      ))}
      {discussionList?.length === 0 && <div>No discussions</div>}
      <AddDiscussion meetingId={meetingId} />
    </div>
  );
};

const Discussion = ({
  id,
  createdAt,
  completed,
  topicsCompleted,
}: {
  id: Id<"discussions">;
  createdAt: number;
  completed: boolean;
  topicsCompleted: boolean;
}) => {
  const updateDiscussion = useMutation(api.discussions.update);

  return (
    <div className="flex gap-2 items-center">
      <div
        className={twMerge(
          "text-lg flex gap-2 items-center",
          completed && topicsCompleted && "line-through",
        )}
      >
        <input
          checked={completed}
          onChange={() => updateDiscussion({ id, completed: !completed })}
          type="checkbox"
        />
        {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  );
};

interface AddDiscussionProps {
  meetingId: Id<"meetings">;
}

const AddDiscussion = ({ meetingId }: AddDiscussionProps) => {
  const createDiscussion = useMutation(api.discussions.create);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDiscussion({ meetingId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <button
        className="bg-emerald-700 text-white rounded-md p-1 text-lg"
        type="submit"
      >
        New Discussion
      </button>
    </form>
  );
};
