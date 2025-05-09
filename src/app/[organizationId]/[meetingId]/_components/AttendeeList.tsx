"use client";

import { useParamIds } from "@/app/[organizationId]/_hooks/useParamIds";
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
import { useState } from "react";

interface User {
  _id: Id<"users">;
  name: string;
}

export const AttendeesList = () => {
  const { meetingId, organizationId } = useParamIds();

  const attendees = useQuery(
    api.users.queries.byMeetingId,
    meetingId && organizationId
      ? {
          meetingId,
          orgId: organizationId,
        }
      : "skip",
  )?.filter(isNonNull);

  const allOrgUsers = useQuery(
    api.users.queries.byOrgId,
    organizationId
      ? {
          orgId: organizationId,
        }
      : "skip",
  )?.filter(isNonNull);

  // TODO: handle loading state
  if (!meetingId || !organizationId) return null;

  return (
    <main className="space-y-4">
      <div className="space-y-2">
        {attendees?.map((attendee) => (
          <Attendee
            key={attendee._id}
            attendee={attendee}
            meetingId={meetingId}
            isLast={attendees.length === 1}
          />
        ))}
        {attendees?.length === 0 && <div>No attendees</div>}
      </div>
      <AddAttendee
        meetingId={meetingId}
        users={allOrgUsers?.filter(
          (user) => !attendees?.some((a) => a._id === user._id),
        )}
      />
    </main>
  );
};

const Attendee = ({
  attendee,
  meetingId,
  isLast,
}: {
  attendee: Doc<"users">;
  meetingId: Id<"meetings">;
  isLast: boolean;
}) => {
  const { organizationId } = useParamIds();
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
            if (organizationId) {
              removeAttendee({
                meetingId,
                userId: attendee._id,
                orgId: organizationId,
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
  users,
}: {
  meetingId: Id<"meetings">;
  users?: User[];
}) => {
  const { organizationId } = useParamIds();
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(
    null,
  );
  const addAttendee = useMutation(api.meetings.mutations.addAttendee);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId || !organizationId) return;
    addAttendee({ meetingId, userId: selectedUserId, orgId: organizationId });
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
