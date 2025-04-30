import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export const AttendenceList = ({
  meetingId,
}: {
  meetingId: Id<"meetings">;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const attendance = useQuery(api.users.listByMeeting, {
    meetingId,
  });
  const canEdit = useQuery(api.meetings.canEdit, { meetingId });

  return isEditing ? (
    <EditAttendance
      attendance={attendance ?? []}
      meetingId={meetingId}
      onCancel={() => setIsEditing(false)}
      onSave={() => setIsEditing(false)}
    />
  ) : (
    <div>
      <div className="flex gap-2 items-center">
        {attendance?.map((user) => <div key={user._id}>{user.name}</div>)}
      </div>
      {canEdit && (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Edit
        </button>
      )}
    </div>
  );
};

const EditAttendance = ({
  attendance,
  meetingId,
  onCancel,
  onSave,
}: {
  attendance: Doc<"users">[];
  meetingId: Id<"meetings">;
  onCancel: () => void;
  onSave: () => void;
}) => {
  const updateMeetingAttendance = useMutation(api.meetingAttendance.update);
  const allUsers = useQuery(api.users.list);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const attendees = formData.getAll("attendees") as Id<"users">[];
    await updateMeetingAttendance({ id: meetingId, attendees });
    onSave();
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      {allUsers?.map((user) => (
        <div key={user._id} className="flex items-center gap-2">
          <input
            type="checkbox"
            name="attendees"
            value={user._id}
            id={`user-${user._id}`}
            defaultChecked={attendance?.some((a) => a._id === user._id)}
            className="rounded border-gray-300"
          />
          <label htmlFor={`user-${user._id}`}>
            {user.name} - {user._id}
          </label>
        </div>
      ))}
      <button
        type="submit"
        className="bg-emerald-800 text-white rounded-md px-2 py-1 text-sm"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white rounded-md px-2 py-1 text-sm"
      >
        Cancel
      </button>
    </form>
  );
};
