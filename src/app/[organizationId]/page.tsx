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
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex items-start gap-2">
        <h1 className="text-6xl font-medium pb-2">Meetings</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-auto pb-20">
        <MeetingList orgId={orgId} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white py-2">
        <div className="w-4xl mx-auto">
          <AddMeetingClient orgId={orgId} />
        </div>
      </div>
    </div>
  );
}
