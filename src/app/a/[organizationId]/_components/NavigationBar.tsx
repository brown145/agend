"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAuthedQuery as useQuery,
  useAuthedQueryWithCache as useQueryWithCache,
} from "@/hooks/convex";
import { formatDiscussionDate } from "@/lib/date";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { ChevronsUpDown, List, Plus, Settings, Squirrel } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NavigationBar() {
  const { organizationId, meetingId, discussionId } = useParams();

  const { data: orgs } = useQueryWithCache(api.organizations.queries.list, {});
  const currentOrgId = organizationId ? organizationId.toString() : null;
  const currentOrganization = orgs
    ? orgs.find((org) => org._id.toString() === currentOrgId)
    : null;

  const { data: meetings } = useQueryWithCache(
    api.meetings.queries.list,
    currentOrgId
      ? {
          orgId: currentOrgId as Id<"organizations">,
        }
      : "skip",
  );
  const currentMeetingId = meetingId ? meetingId.toString() : null;
  const currentMeeting = meetings?.find((mtg) => mtg._id === currentMeetingId);

  const { data: discussions } = useQuery(
    api.discussions.queries.byMeetingId,
    currentMeetingId && currentOrgId
      ? {
          meetingId: currentMeetingId as Id<"meetings">,
          orgId: currentOrgId as Id<"organizations">,
        }
      : "skip",
  );
  const currentDiscussionId = discussionId ? discussionId.toString() : null;
  const currentDiscussion = discussions
    ? discussions.find((disc) => disc._id === currentDiscussionId)
    : null;

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b">
      <div className="flex items-center space-x-1">
        <div className="h-8 w-8 flex items-center justify-center">
          <Squirrel className="h-6 w-6" />
        </div>

        {orgs && orgs.length > 0 && (
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
              {orgs.map((org) => (
                <DropdownMenuItem key={org._id} asChild>
                  <Link href={`/a/${org._id}`} className="flex items-center">
                    {org.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/a/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {meetings && meetings.length > 0 && (
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
                    <Link href={`/a/${currentOrgId}/${mtg._id}`}>
                      {mtg.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/a/${currentOrgId}`}
                    className="flex items-center"
                  >
                    <List className="h-4 w-4" />
                    list
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/a/${currentOrgId}/new`}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4" />
                    new
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {discussions && discussions.length > 0 && (
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
                      href={`/a/${currentOrgId}/${currentMeeting?._id}/${disc._id}`}
                    >
                      {formatDiscussionDate(disc.date)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
