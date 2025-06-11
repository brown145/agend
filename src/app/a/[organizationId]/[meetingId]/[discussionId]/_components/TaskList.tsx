"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { AddTask } from "./AddTask";

export const TaskList = ({
  addable = false,
  completeable = true,
  orgId,
  topicId,
}: {
  addable?: boolean;
  completeable?: boolean;
  orgId: string;
  topicId: string;
}) => {
  const taskList = useQuery(api.tasks.queries.byTopicId, {
    topicId: topicId as Id<"topics">,
    orgId: orgId as Id<"organizations">,
  });

  const isLoading = taskList === undefined;
  const isEmpty = taskList?.length === 0;

  return (
    <div className="flex flex-col border-l-2 border-solid border-gray-300">
      {isLoading ? (
        <>
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </>
      ) : isEmpty && addable ? (
        <div className="text-muted-foreground text-sm pl-4">No tasks</div>
      ) : (
        taskList?.map((task) => (
          <div key={task._id} className="pl-4">
            <Task completeable={completeable} task={task} orgId={orgId} />
          </div>
        ))
      )}
      {addable && (
        <div key="add-task" className="pl-4 pt-2">
          <AddTask orgId={orgId} topicId={topicId} />
        </div>
      )}
    </div>
  );
};

const Task = ({
  completeable,
  task,
  orgId,
}: {
  completeable: boolean;
  task: Doc<"tasks">;
  orgId: string;
}) => {
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
                  disabled={!completeable}
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

const TaskSkeleton = () => (
  <div className="pl-4 py-1 flex items-center gap-2">
    <Skeleton className="size-4 rounded-[4px]" />
    <div className="flex-1 flex flex-row gap-2 items-center">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);
