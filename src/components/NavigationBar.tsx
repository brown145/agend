"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDiscussionDate } from "@/lib/utils/date";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ChevronsUpDown, List, Plus, Settings, Squirrel } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const NavigationBar = () => {
  const params = useParams();
  const { organizationId } = params;
  const { meetingId } = params;
  const { discussionId } = params;

  const { isSignedIn } = useAuth();
  const organizations =
    useQuery(api.organizations.list, isSignedIn ? {} : "skip") ?? [];
  const currentOrganization = organizations.find(
    (org) => org._id === organizationId,
  );

  const meetings =
    useQuery(
      api.meetings.list,
      isSignedIn
        ? {
            orgId: organizationId as Id<"organizations">,
          }
        : "skip",
    ) ?? [];
  const currentMeeting = meetings.find((mtg) => mtg._id === meetingId);

  const discussions =
    useQuery(
      api.discussions.listByMeeting,
      isSignedIn && meetingId
        ? {
            meetingId: meetingId as Id<"meetings">,
            orgId: organizationId as Id<"organizations">,
          }
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

        {organizations.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2">
                <div className="flex items-center gap-0.5">
                  {currentOrganization?.name ?? "Organization"}
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {organizations.map((org) => (
                <DropdownMenuItem key={org._id} asChild>
                  <Link href={`/${org._id}`} className="flex items-center">
                    {org.name}
                  </Link>
                </DropdownMenuItem>
              ))}
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
                    <Link href={`/${organizationId}/${mtg._id}`}>
                      {mtg.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${organizationId}`}
                    className="flex items-center"
                  >
                    <List className="h-4 w-4" />
                    list
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${organizationId}/new`}
                    className="flex items-center"
                  >
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
                          ? formatDiscussionDate(currentDiscussion.date)
                          : "Discussions"}
                        <ChevronsUpDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {discussions.map((disc) => (
                      <DropdownMenuItem key={disc._id} asChild>
                        <Link
                          href={`/${organizationId}/${currentMeeting?._id}/${disc._id}`}
                        >
                          {formatDiscussionDate(disc.date)}
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
