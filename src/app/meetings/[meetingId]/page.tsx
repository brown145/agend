export default function MeetingsPage({
  params,
}: {
  params: { meetingId: string };
}) {
  return <div>Meetings Page {params.meetingId}</div>;
}
