run commands:
```
asdf shell nodejs 23.1.0
bun dev
bunx convex dev
```

# v0.1 Org management
1. ✔ Init new users in "personal" org
1. ✔ associate meetings to orgs
1. "personal" org can have no attendence (other than self)
1. ✔ many-to-many org-to-user 
1. ✔ build useAuthedQuery and useAuthedMutation that abstract auth and org restrictions
1. simplify canView and canEdit logic to be just user.orgs.includes(meeting.org) -> update schema and indexes to match, orgId on all 
1. remove findUser

# v0.2 New meeting flow
1. get rid of meetings/new; instead create a meeting and land on /meetings/{meetingId}?edit=true

# v0.3 discussion management
1. build "next" discussion concept
1. build "start" functionality
1. build "previous" discussion concept

# v0.4 summary / recap
1. build recap from previous
1. build summary of current

# v0.5 basic topic / task ownership
1. add/edit task owner
1. add/edit topic owner

# v0.6 urls
1. slugs for url

# v1.0 Workable product
1. publish on Clerk / Convex / Vercel

# 1.1 advanced topic / task ownership
1. postpone topic
1. topic ordering / reordering
1. focused topic (add tasks for focused topic only)

# 1.2 advanced org management
1. create org
1. invite to org
1. request to join org

# 1.3 perf / useability 
1. loading.tsx
1. error.tsx
1. react transitions