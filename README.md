run commands:
```
asdf shell nodejs 23.1.0
bun dev
bunx convex dev
```

# v0.1 Org management
1. ✔ Init new users in "personal" org
1. ✔ associate meetings to orgs
1. ~~"personal" org can have no attendence (other than self)~~ we dont add right now so cannot enforce
1. ✔ many-to-many org-to-user 
1. ✔ build useAuthedQuery and useAuthedMutation that abstract auth and org restrictions
1. ✔ simplify canView and canEdit logic to be just user.orgs.includes(meeting.org) -> update schema and indexes to match, orgId on all 
1. ✔ remove findUser

# v0.2 New meeting flow
1. ~~get rid of meetings/new; instead create a meeting and land on /meetings/{meetingId}?edit=true~~ no this seems like a bad flow, cannot be canceled and cannot be linked to

# v0.3 discussion management
1. ✔ build "next" discussion concept
1. ✔ build "start" functionality
1. build "previous" discussion concept

# v0.4 summary / recap
1. build recap from previous
1. build summary of current

# v0.5 basic topic / task ownership
1. add/edit task owner
1. add/edit topic owner

# v0.6 urls
1. slugs for url

# v0.7 server function cleanup
1. use folder structure conventsions:
  ```
  convex/
    users/
        queries.ts
        mutations.ts
        schema.ts (maybe)
    posts/
        queries.ts
        mutations.ts
        schema.ts (maybe)
    schema.ts
  ```
1. remove unused functions
1. remove manyToMany.ts functions... move to one of the objects or helper functions helper.object.ts
1. review for consistency in function names and arguments (get vs details) / (orgId vs organizationId)
1. review where in schema we want orgIds (meeting? discussions? tasks?...)
1. cleanup argument names (id vs meetingId)
1. cleanup throw vs null response

# v0.8 cleanup components
1. avoid useParams or useParamIds in components; pass in from parent page
1. avoid data fetching and mutions in comopnents; pass in handlers from parent page

# v1.0 Workable product
1. write a proper readme
1. publish to github
1. publish on Clerk / Convex / Vercel

# v1.1 Toasts
1. use toasts to confirm user actions

# 1.2 advanced topic / task ownership
1. postpone topic
1. topic ordering / reordering
1. focused topic (add tasks for focused topic only)

# 1.3 advanced org management
1. create org
1. invite to org
1. request to join org

# 1.4 perf / useability 
1. loading.tsx
1. error.tsx
1. react transitions