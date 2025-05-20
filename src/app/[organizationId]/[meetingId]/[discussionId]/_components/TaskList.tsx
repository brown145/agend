"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { AddTask } from "./AddTask";

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
    <div className="flex flex-col gap-1">
      {taskList?.map((task) => (
        <div
          key={task._id}
          className="border-l-2 border-solid border-gray-300 pl-4"
        >
          <Task task={task} orgId={orgId} />
        </div>
      ))}
      {editable && taskList?.length === 0 && (
        <div className="text-muted-foreground text-sm">No tasks</div>
      )}
      {editable && <AddTask orgId={orgId} topicId={topicId} />}
    </div>
  );
};

const Task = ({ task, orgId }: { task: Doc<"tasks">; orgId: string }) => {
  const updateTask = useMutation(api.tasks.mutations.complete);
  const owner = useQuery(api.users.queries.byUserId, {
    userId: task.owner,
    orgId: orgId as Id<"organizations">,
  });

  const form = useForm({
    defaultValues: {
      completed: task.completed,
    },
  });

  const onSubmit = (values: { completed: boolean }) => {
    updateTask({
      taskId: task._id,
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
              task.completed ? "line-through text-muted-foreground" : ""
            }
          >
            {task.text}
          </span>
          <div className="text-muted-foreground text-sm">
            {task.freeformOwner ? (
              <>{task.freeformOwner}</>
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
