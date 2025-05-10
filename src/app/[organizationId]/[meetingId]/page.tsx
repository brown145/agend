import DiscussionList from "./_components/DiscussionList";
import { MeetingHeader } from "./_components/MeetingHeader";

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    meetingId: string;
  }>;
}) {
  const { organizationId: orgId, meetingId } = await params;

  return (
    <div className="flex flex-col gap-2">
      <MeetingHeader orgId={orgId} meetingId={meetingId} />
      <DiscussionList orgId={orgId} meetingId={meetingId} />
    </div>
  );
}
