"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthedQuery as useQuery } from "@/hooks/convex";
import { formatDiscussionDate } from "@/lib/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { TopicList, TopicSkeleton } from "./TopicList";

export default function DiscussionReview({
  editable = true,
  discussionId,
  organizationId,
}: {
  editable: boolean;
  discussionId: string;
  organizationId: string;
}) {
  const { data: previousDiscussions, isPending } = useQuery(
    api.discussions.queries.previousIncompletedDiscussions,
    {
      discussionId: discussionId as Id<"discussions">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  const defaultValue = previousDiscussions?.[0]?._id ?? "default";

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={[defaultValue]}>
        {isPending ? (
          <AccordionItem key={defaultValue} value={defaultValue}>
            <CardTitle className="text-2xl">
              <Skeleton className="h-6 w-48 mb-2" />
            </CardTitle>
            <AccordionContent>
              <TopicSkeleton />
            </AccordionContent>
          </AccordionItem>
        ) : !previousDiscussions?.length ? (
          <AccordionItem key={defaultValue} value={defaultValue}>
            <CardTitle className="text-2xl">No previous discussions</CardTitle>
          </AccordionItem>
        ) : (
          previousDiscussions.map((prevDiscussion) => (
            <AccordionItem key={prevDiscussion._id} value={prevDiscussion._id}>
              <AccordionTrigger>
                <CardTitle className="text-2xl">
                  {formatDiscussionDate(prevDiscussion.date)}
                </CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                {organizationId ? (
                  <div>
                    <TopicList
                      addable={false}
                      completeable={editable}
                      discussionId={prevDiscussion._id}
                      orgId={organizationId}
                    />
                  </div>
                ) : (
                  <div>could not find organization</div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>
    </div>
  );
}
