"use client";

import { MeetingStepper } from "@/components/MeetingStepper";
import {
  useAuthedMutation as useMutation,
  useAuthedQuery as useQuery,
  useAuthedQueryWithCache as useQueryWithCache,
} from "@/hooks/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import DiscussionReview from "./DiscussionReview";
import DiscussionSummary from "./DiscussionSummary";
import { TopicList } from "./TopicList";

export const DiscussionClient = ({
  discussionId,
  organizationId,
  meetingId,
}: {
  discussionId: string;
  organizationId: string;
  meetingId: string;
}) => {
  const { data: meetingDetails } = useQueryWithCache(
    api.meetings.queries.byMeetingId,
    {
      meetingId: meetingId as Id<"meetings">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  const { data: discussion } = useQuery(
    api.discussions.queries.byDiscussionId,
    {
      discussionId: discussionId as Id<"discussions">,
      orgId: organizationId as Id<"organizations">,
    },
  );

  const updateActiveStep = useMutation(
    api.discussions.mutations.updateActiveStep,
  );

  const handleStepChange = (step: number) => {
    updateActiveStep({
      discussionId: discussionId as Id<"discussions">,
      activeStep: step,
      orgId: organizationId as Id<"organizations">,
    });
  };

  const isNextDiscussion =
    meetingDetails?.nextDiscussionId &&
    discussion?._id === meetingDetails.nextDiscussionId;

  return isNextDiscussion ? (
    <TopicList discussionId={discussionId} orgId={organizationId} />
  ) : (
    <MeetingStepper
      activeStep={discussion?.activeStep ?? 0}
      setActiveStep={handleStepChange}
      stepContents={{
        recap: (disabled) => (
          <DiscussionReview
            editable={!disabled}
            discussionId={discussionId}
            organizationId={organizationId}
          />
        ),
        discussion: (disabled) => (
          <TopicList
            addable={!disabled}
            completeable={!disabled}
            discussionId={discussionId}
            orgId={organizationId}
          />
        ),
        review: () => (
          <DiscussionSummary
            discussionId={discussionId}
            organizationId={organizationId}
            meetingId={meetingId}
          />
        ),
      }}
    />
  );
};
