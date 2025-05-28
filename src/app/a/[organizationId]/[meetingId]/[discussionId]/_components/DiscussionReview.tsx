"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardTitle } from "@/components/ui/card";
import { formatDiscussionDate } from "@/lib/utils/date";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { TopicList } from "./TopicList";

export default function DiscussionReview({
  disabled = false,
  discussionId,
  organizationId,
}: {
  disabled: boolean;
  discussionId: string;
  organizationId: string;
}) {
  const discussion = useQuery(api.discussions.queries.byDiscussionId, {
    discussionId: discussionId as Id<"discussions">,
    orgId: organizationId as Id<"organizations">,
  });

  const previousDiscussions = useQuery(
    api.discussions.queries.previousIncompletedDiscussions,
    {
      discussionId: discussionId as Id<"discussions">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  if (!discussion) return null;

  if (!previousDiscussions?.length) return null;

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={[previousDiscussions[0]._id]}>
        {previousDiscussions.map((prevDiscussion) => (
          <AccordionItem key={prevDiscussion._id} value={prevDiscussion._id}>
            <AccordionTrigger>
              <CardTitle>{formatDiscussionDate(prevDiscussion.date)}</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              {organizationId ? (
                <div className="pt-2">
                  <TopicList
                    disabled={disabled}
                    discussionId={prevDiscussion._id}
                    editable={false}
                    orgId={organizationId}
                  />
                </div>
              ) : (
                <div>could not find organization</div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
