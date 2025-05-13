"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { CalendarPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  owner: z.string().min(1, "owner is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const AddMeeting = ({
  onSubmit,
  orgId,
}: {
  onSubmit: (id: string) => void;
  orgId: string;
}) => {
  const createMeeting = useMutation(api.meetings.mutations.create);

  const orgUsers = useQuery(api.users.queries.byOrgId, {
    orgId: orgId as Id<"organizations">,
  });

  const currentUser = orgUsers?.find((user) => user.isYou);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      owner: "",
    },
  });

  useEffect(() => {
    if (currentUser?._id && !form.getValues("owner")) {
      form.setValue("owner", currentUser._id);
    }
  }, [currentUser?._id, form]);

  const userItems =
    orgUsers?.map((user) => ({
      value: user._id,
      label: user.name,
    })) ?? [];

  const handleSubmit = async (values: FormValues) => {
    const id = await createMeeting({
      title: values.title,
      orgId: orgId as Id<"organizations">,
      ownerId: values.owner as Id<"users">,
    });
    onSubmit(id);
    form.reset();
    form.setValue("owner", values.owner ?? "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="p-2 pl-3 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="New meeting title"
                      className="p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      items={userItems}
                      value={field.value}
                      onSelect={field.onChange}
                      placeholder="Select owner"
                      emptyText="No users found"
                      className="w-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" className="shrink-0">
              <CalendarPlus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};
