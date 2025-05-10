import MeetingList from "./_components/MeetingList";
import MeetingsHeader from "./_components/MeetingsHeader";

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
  }>;
}) {
  const { organizationId: orgId } = await params;

  return (
    <div className="h-full flex flex-col gap-2">
      <MeetingsHeader orgId={orgId} />
      <MeetingList orgId={orgId} />
    </div>
  );
}
