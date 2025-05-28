"use client";

import { Button } from "@/components/ui/button";
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
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().min(1, "Task description is required"),
  owner: z.string().min(1, "Owner is required"),
  freeformOwner: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddTask = ({
  topicId,
  orgId,
}: {
  topicId: string;
  orgId: string;
}) => {
  const [isFreeformOwner, setIsFreeformOwner] = useState(false);
  const createTask = useMutation(api.tasks.mutations.create);
  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const currentUser = orgUsers?.find((user) => user.isYou);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      owner: "",
      freeformOwner: "",
    },
  });

  useEffect(() => {
    if (currentUser?._id && !form.getValues("owner")) {
      form.setValue("owner", currentUser._id);
    }
  }, [currentUser?._id, form]);

  const onSubmit = (values: FormValues) => {
    if (isFreeformOwner && values.freeformOwner) {
      createTask({
        text: values.text,
        topicId: topicId as Id<"topics">,
        orgId: orgId as Id<"organizations">,
        owner: currentUser?._id as Id<"users">,
        freeformOwner: values.freeformOwner,
      });
    } else {
      createTask({
        text: values.text,
        topicId: topicId as Id<"topics">,
        orgId: orgId as Id<"organizations">,
        owner: values.owner as Id<"users">,
      });
    }
    form.reset();
    form.setValue("owner", (values.owner || currentUser?._id) as Id<"users">);
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
                <Input placeholder="Enter task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="freeformOwner"
            render={({ field }) => {
              if (isFreeformOwner) {
                return (
                  <FormItem className="w-[200px]">
                    <FormControl>
                      <Input placeholder="Enter owner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }
              return <></>;
            }}
          />
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => {
              if (!isFreeformOwner) {
                return (
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
                );
              }
              return <></>;
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsFreeformOwner(!isFreeformOwner)}
            className="h-9 w-9"
          >
            {isFreeformOwner ? (
              <Users className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button type="submit" disabled={!form.formState.isValid}>
          Add task
        </Button>
      </form>
    </Form>
  );
};
