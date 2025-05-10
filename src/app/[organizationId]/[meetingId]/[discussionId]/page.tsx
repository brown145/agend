import DiscussionHeader from "./_components/DiscussionHeader";
import DiscussionReview from "./_components/DiscussionReview";
import DiscussionSummary from "./_components/DiscussionSummary";
import { TopicList } from "./_components/TopicList";

export default async function DiscussionPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    meetingId: string;
    discussionId: string;
  }>;
}) {
  const { organizationId, meetingId, discussionId } = await params;

  return (
    <div className="flex flex-col gap-2">
      <DiscussionHeader
        discussionId={discussionId}
        organizationId={organizationId}
        meetingId={meetingId}
      />
      <DiscussionReview
        discussionId={discussionId}
        organizationId={organizationId}
      />
      <h2 className="text-lg font-bold">Topics</h2>
      <TopicList discussionId={discussionId} orgId={organizationId} />
      <DiscussionSummary
        discussionId={discussionId}
        organizationId={organizationId}
        meetingId={meetingId}
      />
    </div>
  );
}
