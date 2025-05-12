"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { isNonNull } from "@/lib/isNotNull";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

export const AttendeesList = () => {
  const { meetingId, organizationId } = useParams();

  const attendees = useQuery(
    api.users.queries.byMeetingId,
    meetingId && organizationId
      ? {
          meetingId: meetingId as Id<"meetings">,
          orgId: organizationId as Id<"organizations">,
        }
      : "skip",
  )?.filter(isNonNull);

  const allOrgUsers = useQuery(
    api.users.queries.byOrgId,
    organizationId
      ? {
          orgId: organizationId as Id<"organizations">,
        }
      : "skip",
  )?.filter(isNonNull);

  return (
    <main className="space-y-4">
      <div className="space-y-2">
        {attendees?.map((attendee) => (
          <Attendee
            attendee={attendee}
            isLast={attendees.length === 1}
            key={attendee._id}
            meetingId={meetingId as string}
            orgId={organizationId as string}
          />
        ))}
        {attendees?.length === 0 && <div>No attendees</div>}
      </div>
      <AddAttendee
        meetingId={meetingId as string}
        orgId={organizationId as string}
        users={allOrgUsers?.filter(
          (user) => !attendees?.some((a) => a._id === user._id),
        )}
      />
    </main>
  );
};

const Attendee = ({
  attendee,
  isLast,
  meetingId,
  orgId,
}: {
  attendee: Doc<"users">;
  isLast: boolean;
  meetingId: string;
  orgId: string;
}) => {
  const removeAttendee = useMutation(api.meetings.mutations.removeAttendee);

  if (!attendee) return null;

  return (
    <div className="flex items-center justify-between">
      <span>{attendee.name}</span>
      {!isLast && (
        <Button
          className="text-muted-foreground"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (orgId) {
              removeAttendee({
                meetingId: meetingId as Id<"meetings">,
                userId: attendee._id,
                orgId: orgId as Id<"organizations">,
              });
            }
          }}
        >
          Remove
        </Button>
      )}
    </div>
  );
};

const AddAttendee = ({
  meetingId,
  orgId,
  users,
}: {
  meetingId: string;
  orgId: string;
  users?: Doc<"users">[];
}) => {
  const addAttendee = useMutation(api.meetings.mutations.addAttendee);

  const handleUserSelect = (userId: string) => {
    if (!orgId) return;
    addAttendee({
      meetingId: meetingId as Id<"meetings">,
      userId: userId as Id<"users">,
      orgId: orgId as Id<"organizations">,
    });
  };

  if (!users?.length) return null;

  const items = users.map((user) => ({
    value: user._id,
    label: user.name,
  }));

  return (
    <div className="flex gap-2 w-full">
      <Combobox
        items={items}
        onSelect={handleUserSelect}
        placeholder="Add attendee"
        emptyText="No users found"
      />
    </div>
  );
};
