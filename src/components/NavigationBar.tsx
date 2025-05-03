"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ChevronsUpDown, List, Plus, Settings, Squirrel } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const NavigationBar = () => {
  const params = useParams();
  const { meetingId } = params;
  const { discussionId } = params;

  const { isSignedIn } = useAuth();
  const organization = useQuery(
    api.organizations.details,
    isSignedIn ? {} : "skip",
  );

  const meetings = useQuery(api.meetings.list, isSignedIn ? {} : "skip") ?? [];
  const currentMeeting = meetings.find((mtg) => mtg._id === meetingId);

  const discussions =
    useQuery(
      api.discussions.listByMeeting,
      isSignedIn && meetingId
        ? { meetingId: meetingId as Id<"meetings"> }
        : "skip",
    ) ?? [];
  const currentDiscussion = discussions.find(
    (disc) => disc._id === discussionId,
  );

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b">
      <div className="flex items-center space-x-1">
        <div className="h-8 w-8 flex items-center justify-center">
          <Squirrel className="h-6 w-6" />
        </div>

        {organization && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2">
                <div className="flex items-center gap-0.5">
                  {organization?.name ?? "Organization"}
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                key={organization?._id ?? "organization"}
                asChild
              >
                <Link href="/settings" className="flex items-center">
                  {organization?.name ?? "Organization"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {meetings.length > 0 && (
          <>
            <span className="text-muted-foreground">/</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2">
                  <div className="flex items-center gap-0.5">
                    {currentMeeting?.title ?? "Meetings"}
                    <ChevronsUpDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {meetings.map((mtg) => (
                  <DropdownMenuItem key={mtg._id} asChild>
                    <Link href={`/meetings/${mtg._id}`}>{mtg.title}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/meetings" className="flex items-center">
                    <List className="h-4 w-4" />
                    list
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/meetings/new" className="flex items-center">
                    <Plus className="h-4 w-4" />
                    new
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {discussions.length > 0 && (
              <>
                <span className="text-muted-foreground">/</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2">
                      <div className="flex items-center gap-0.5">
                        {currentDiscussion
                          ? new Date(
                              currentDiscussion._creationTime,
                            ).toLocaleDateString()
                          : "Discussions"}
                        <ChevronsUpDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {discussions.map((disc) => (
                      <DropdownMenuItem key={disc._id} asChild>
                        <Link
                          href={`/meetings/${currentMeeting?._id}/${disc._id}`}
                        >
                          {new Date(
                            disc._creationTime ?? 0,
                          ).toLocaleDateString() ?? "Discussions"}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </>
        )}
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};
