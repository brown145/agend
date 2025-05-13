import AddMeetingClient from "./_components/AddMeetingClient";
import MeetingList from "./_components/MeetingList";

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
  }>;
}) {
  const { organizationId: orgId } = await params;

  return (
    <div className="flex-1 p-4 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <h1 className="text-6xl font-medium">Meetings</h1>
      </div>
      <div className="flex-1">
        <MeetingList orgId={orgId} />
      </div>
      <AddMeetingClient orgId={orgId} />
    </div>
  );
}
