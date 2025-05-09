"use client";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MeetingHeader({
  meetingId,
  organizationId,
}: {
  meetingId: Id<"meetings">;
  organizationId: Id<"organizations">;
}) {
  const meetingDetails = useQuery(api.meetings.queries.byMeetingId, {
    meetingId,
    orgId: organizationId,
  });
  //   const updateMeeting = useMutation(api.meetings.mutations.);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = searchParams.get("edit") === "true";

  const setEditMode = (edit: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (edit) {
      params.set("edit", "true");
    } else {
      params.delete("edit");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTitle = formData.get("title") as string;
    // TODO: update meeting
    alert(`TODO ${newTitle}`);
    // await updateMeeting({
    //   id: meeting._id,
    //   orgId: meeting.orgId,
    //   title: newTitle,
    // });
    setEditMode(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="title"
            defaultValue={meetingDetails?.title}
            className="border-2 border-gray-300 rounded-md p-1"
            autoFocus
          />
          <button
            type="submit"
            className="bg-emerald-800 text-white rounded-md px-2 py-1 text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white rounded-md px-2 py-1 text-sm"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Attendees</div>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-6xl font-medium" onClick={() => setEditMode(true)}>
        {meetingDetails?.title}
      </h1>
      <div className="text-muted-foreground">
        {meetingDetails?.isYours ? "Yours" : meetingDetails?.owner?.name}
      </div>
    </div>
  );
}
