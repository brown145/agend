"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useParamIds } from "../_hooks/useParamIds";

export default function MeetingsPage() {
  const { meetingId, organizationId } = useParamIds();

  const meeting = useQuery(
    api.meetings.details,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  );

  const discussions = useQuery(
    api.discussions.listByMeeting,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  );

  const createDiscussion = useMutation(api.discussions.create);

  const handleNewDiscussion = () => {
    if (meetingId && organizationId) {
      createDiscussion({ meetingId, orgId: organizationId });
    }
  };

  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <MeetingHeader meeting={meeting} />
        <Button
          variant="link"
          size="sm"
          className="w-fit text-muted-foreground"
        >
          <div onClick={handleNewDiscussion}>New discussion</div>
        </Button>
      </div>
      <div className="flex flex-col">
        {discussions?.map((discussion) => (
          <div key={discussion._id} className="hover:underline">
            <Link href={`/${organizationId}/${meetingId}/${discussion._id}`}>
              {new Date(discussion._creationTime).toLocaleDateString()}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const MeetingHeader = ({ meeting }: { meeting: Doc<"meetings"> }) => {
  const updateMeeting = useMutation(api.meetings.update);
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
    await updateMeeting({ id: meeting._id, title: newTitle });
    setEditMode(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="title"
            defaultValue={meeting.title}
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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div
          className="text-xl font-semibold"
          onClick={() => setEditMode(true)}
        >
          {meeting.title}
        </div>
      </div>
    </div>
  );
};
