"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface User {
  _id: Id<"users">;
  name: string;
}

export const AttendeesList = () => {
  const { meetingId: _meetingId, organizationId: _organizationId } =
    useParams();
  const organizationId = _organizationId as Id<"organizations">;
  const meetingId = _meetingId as Id<"meetings">;

  const attendees = useQuery(api.users.listByMeeting, {
    meetingId,
    orgId: organizationId,
  });
  const allOrgUsers = useQuery(api.users.listUsersInOrganization, {
    orgId: organizationId,
  });

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
  const { organizationId } = useParams();
  const orgId = organizationId as Id<"organizations">;
  const removeAttendee = useMutation(api.meetingAttendance.remove);

  if (!attendee) return null;

  return (
    <div className="flex items-center justify-between">
      <span>{attendee.name}</span>
      {!isLast && (
        <Button
          className="text-muted-foreground"
          variant="ghost"
          size="sm"
          onClick={() =>
            removeAttendee({ meetingId, userId: attendee._id, orgId })
          }
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
  const { organizationId } = useParams();
  const orgId = organizationId as Id<"organizations">;
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(
    null,
  );
  const addAttendee = useMutation(api.meetingAttendance.add);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId) return;
    addAttendee({ meetingId, userId: selectedUserId, orgId });
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
