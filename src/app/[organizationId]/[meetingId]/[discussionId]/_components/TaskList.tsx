"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().min(1, "Task description is required"),
  assignee: z.string().min(1, "Assignee is required"),
});

const taskFormSchema = z.object({
  completed: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;
type TaskFormValues = z.infer<typeof taskFormSchema>;

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

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      completed: task.completed,
    },
  });

  const onSubmit = (values: TaskFormValues) => {
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
          <div className="text-muted-foreground text-sm">{owner?.name}</div>
        </div>
      </form>
    </Form>
  );
};

const AddTask = ({ orgId, topicId }: { orgId: string; topicId: string }) => {
  const createTask = useMutation(api.tasks.mutations.create);
  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      assignee: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createTask({
      topicId: topicId as Id<"topics">,
      text: values.text,
      orgId: orgId as Id<"organizations">,
      owner: values.assignee as Id<"users">,
    });
    form.reset();
  };

  const userItems =
    orgUsers?.map((user) => ({
      value: user._id,
      label: user.name,
    })) ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Combobox
                  items={userItems}
                  value={field.value}
                  onSelect={field.onChange}
                  placeholder="Select assignee"
                  emptyText="No users found"
                  className="w-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="default">
          Add task
        </Button>
      </form>
    </Form>
  );
};
