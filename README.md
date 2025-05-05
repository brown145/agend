# V0.1

1. Init new users in "personal" org
1. associate meetings to orgs
1. "personal" org can have no attendence (other than self)
1. many-to-many org-to-user 
1. build useAuthedQuery and useAuthedMutation that abstract auth and org restrictions
1. simplify canView and canEdit logic to be just user.orgs.includes(meeting.org) -> update schema and indexes to match, orgId on all 
1. get rid of meetings/new; instead create a meeting and land on /meetings/{meetingId}?edit=true
1. build "next" discussion concept
1. build "start" functionality
1. build "previous" discussion concept
1. build recap from previous
1. build summary of current
1. topic ordering / reordering
1. focused topic (add tasks for focused topic only)
1. add/edit task owner
1. add/edit topic owner
1. publish on Clerk / Convex / Vercel