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
          <div className="text-muted-foreground text-sm">{owner?.name}</div>
        </div>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  text: z.string().min(1, "Topic description is required"),
  owner: z.string().min(1, "Owner is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AddTopic = ({
  discussionId,
  orgId,
}: {
  discussionId: string;
  orgId: string;
}) => {
  const createTopic = useMutation(api.topics.mutations.create);
  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      owner: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createTopic({
      text: values.text,
      discussionId: discussionId as Id<"discussions">,
      orgId: orgId as Id<"organizations">,
      owner: values.owner as Id<"users">,
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
                <Input placeholder="Enter topic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem className="w-[200px]">
              <FormControl>
                <Combobox
                  items={userItems}
                  value={field.value}
                  onSelect={field.onChange}
                  placeholder="Select owner"
                  emptyText="No users found"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isValid}>
          Add topic
        </Button>
      </form>
    </Form>
  );
};
