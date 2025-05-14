"use client";

import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddMeeting } from "../new/_components/AddMeeting"; // TODO: move this to components folder?

export default function AddMeetingClient({ orgId }: { orgId: string }) {
  const router = useRouter();

  const handleSubmit = (id: string, title: string) => {
    toast.success("Meeting created", {
      description: `${title}`,
      duration: 5000,
      icon: <Calendar className="w-4 h-4 mr-2" />,
      action: {
        label: "View",
        onClick: () => router.push(`/${orgId}/${id}`),
      },
    });
  };

  return <AddMeeting orgId={orgId} onSubmit={handleSubmit} />;
}
