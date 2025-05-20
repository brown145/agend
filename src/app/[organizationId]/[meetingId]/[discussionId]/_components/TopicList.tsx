"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { AddTopic } from "./AddTopic";
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
    <div className="flex flex-col gap-4">
      {topicList?.map((topic) => (
        <div
          key={topic._id}
          className="border-l-2 border-solid border-gray-500 pl-2 flex flex-col gap-1"
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

  const form = useForm({
    defaultValues: {
      completed: topic.completed,
    },
  });

  const onSubmit = (values: { completed: boolean }) => {
    updateTopic({
      topicId: topic._id,
      isCompleted: values.completed,
      orgId: orgId as Id<"organizations">,
    });
  };

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
        className="flex gap-1 items-center"
      >
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex-1 flex flex-row gap-2 items-center">
          <span
            className={
              topic.completed ? "line-through text-muted-foreground" : ""
            }
          >
            {topic.text}
          </span>
          <div className="text-muted-foreground text-sm">
            {topic.freeformOwner ? (
              <>{topic.freeformOwner}</>
            ) : owner?.name ? (
              <>{owner?.name}</>
            ) : (
              <>unknown</>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
