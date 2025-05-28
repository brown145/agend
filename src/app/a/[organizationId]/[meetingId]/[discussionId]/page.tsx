import { DiscussionClient } from "./_components/DiscussionClient";
import DiscussionHeader from "./_components/DiscussionHeader";

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
      <DiscussionClient
        discussionId={discussionId}
        organizationId={organizationId}
        meetingId={meetingId}
      />
    </div>
  );
}
