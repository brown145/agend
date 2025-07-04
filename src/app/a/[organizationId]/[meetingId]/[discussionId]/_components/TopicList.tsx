"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAuthedMutation as useMutation,
  useAuthedQuery as useQuery,
  useAuthedQueryWithCache as useQueryWithCache,
} from "@/hooks/convex";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { AddTopic } from "./AddTopic";
import { TaskList, TaskSkeleton } from "./TaskList";

export const TopicList = ({
  addable = true,
  completeable = true,
  discussionId,
  orgId,
  showEmptyState = true,
}: {
  discussionId: string;
  addable?: boolean;
  completeable?: boolean;
  orgId: string;
  showEmptyState?: boolean;
}) => {
  const { data: topics, isPending } = useQuery(
    api.topics.queries.byDiscussionId,
    {
      discussionId: discussionId as Id<"discussions">,
      orgId: orgId as Id<"organizations">,
    },
  );
  const topicIds = topics?.map((topic) => topic._id);

  return (
    <div className="flex flex-col gap-4">
      {isPending ? (
        <>
          <TopicSkeleton />
          <TopicSkeleton />
        </>
      ) : (
        topicIds?.map((topicId) => (
          <div key={topicId} className="flex flex-col gap-2">
            <Topic
              completeable={completeable}
              topicId={topicId}
              orgId={orgId}
            />
            <TaskList
              addable={addable}
              completeable={completeable}
              orgId={orgId}
              topicId={topicId}
            />
          </div>
        ))
      )}
      {showEmptyState && topicIds?.length === 0 && <div>No topics</div>}
      {addable && (
        <div className="pt-2">
          <AddTopic discussionId={discussionId} orgId={orgId} />
        </div>
      )}
    </div>
  );
};

const Topic = ({
  completeable = true,
  topicId,
  orgId,
}: {
  completeable?: boolean;
  topicId: string;
  orgId: string;
}) => {
  const { data: topicData } = useQuery(api.topics.queries.byTopicId, {
    topicId: topicId as Id<"topics">,
    orgId: orgId as Id<"organizations">,
  });

  const updateTopic = useMutation(api.topics.mutations.close);
  const { data: owner } = useQueryWithCache(
    api.users.queries.byUserId,
    topicData?.owner
      ? {
          userId: topicData.owner,
          orgId: orgId as Id<"organizations">,
        }
      : "skip",
  );

  const form = useForm({
    defaultValues: {
      isClosed: topicData?.isClosed ?? false,
    },
  });

  // TODO: is this needed?
  if (topicData && form.getValues("isClosed") !== topicData.isClosed) {
    console.log(">> updating form", topicData.isClosed);
    form.setValue("isClosed", topicData.isClosed);
  }

  const onSubmit = (values: { isClosed: boolean }) => {
    if (!topicData) return;
    updateTopic({
      topicId: topicData._id,
      isClosed: values.isClosed,
      orgId: orgId as Id<"organizations">,
    });
  };

  // TODO: is this needed?
  if (!topicData) {
    console.log(">> topicData is undefined");
    return (
      <div className="flex gap-2 items-center text-xl font-bold leading-tight min-h-[2.5rem]">
        foobar
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center text-xl font-bold leading-tight min-h-[2.5rem]"
      >
        <FormField
          control={form.control}
          name="isClosed"
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
        <div className="flex-1 flex flex-row gap-2 items-baseline">
          <span
            className={cn(
              "text-xl font-semibold leading-tight",
              topicData.isResolved && "line-through text-muted-foreground",
            )}
          >
            {topicData.text}
          </span>
          <div className="text-muted-foreground text-sm font-normal">
            {topicData.freeformOwner ? (
              <>{topicData.freeformOwner}</>
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

export const TopicSkeleton = () => (
  <div className="border-l-2 border-solid border-gray-500 pl-2 flex flex-col gap-1">
    <div className="flex gap-1 items-center">
      <div className="flex-1 flex flex-row gap-2 items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <TaskSkeleton />
    <TaskSkeleton />
    <TaskSkeleton />
  </div>
);
