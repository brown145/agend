"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isNonNull } from "@/lib/isNotNull";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

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
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(
    null,
  );
  const addAttendee = useMutation(api.meetings.mutations.addAttendee);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId || !orgId) return;
    addAttendee({
      meetingId: meetingId as Id<"meetings">,
      userId: selectedUserId,
      orgId: orgId as Id<"organizations">,
    });
    setSelectedUserId(null);
  };

  if (!users?.length) return null;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedUserId
              ? users.find((u) => u._id === selectedUserId)?.name
              : "Select user"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {users.map((user) => (
            <DropdownMenuItem
              key={user._id}
              onClick={() => setSelectedUserId(user._id)}
            >
              {user.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="submit" disabled={!selectedUserId}>
        Add attendee
      </Button>
    </form>
  );
};
