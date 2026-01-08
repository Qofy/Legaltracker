
# Comments Panel — How it Works

This document explains how the `CommentsPannel` component works, how it integrates with the dashboard, the expected API shape, visibility/permission rules, and how to test or extend it.

Files
- `frontend/src/components/comments/CommentsPannel.vue` — main UI and logic for listing, creating, and updating comments.
- `frontend/src/views/Dashboard.vue` — integrates the comments panel and provides case selection (`selectedCaseForComments`).
- `frontend/src/services/entities/Comment.js` — API service used by the component (`list`, `filter`, `create`, `update`).

How to use

- In the dashboard we select a case and pass its id to the comments panel:

```vue
<CommentsPannel :case-id="selectedCaseForComments?.id" :user="user" />
```

- The component reads `caseId` and loads comments via `Comment.filter({ case_id })`.

Comment CRUD flow

- List/Filter: `Comment.filter({ case_id }, '-created_date', 50)` is used to fetch comments for the current case.
- Create: the component sends a POST payload to create a comment with the fields:
  - `case_id` (number|string)
  - `content` (string)
  - `comment_type` (one of `note|question|update|reminder`)
  - `is_shared` (boolean)
  - `is_internal` (boolean — only saved if the current user is a lawyer or admin)

Example create payload

```json
{
  "case_id": 123,
  "content": "Client called, we scheduled an appointment.",
  "comment_type": "update",
  "is_shared": true,
  "is_internal": false
}
```

Visibility / Permission Rules (implemented in `CommentsPannel.vue`)

- If the comment `created_by` matches the current user's email, the user is the owner and can always see their private comments.
- Admin users see all comments.
- Shared comments (`is_shared === true`) are visible to everyone except when `is_internal === true` — internal comments are visible only to lawyers and admins.
- Private comments (`is_shared === false`) are visible only to the comment owner and admins.

UI behaviours

- Selecting a case: clicking a case card in `Dashboard.vue` calls `selectCaseForComments(case)` and passes the `case.id` to the panel.
- Add comment: click the `+` icon in the comments header (disabled when no case is selected), fill title/description, choose type/privacy/internal, then Post.
- Toggle share: owners can toggle `is_shared` on existing comments (calls `Comment.update(id, { is_shared: ... })`).
- Internal toggle: visible only to lawyers/admins and sets `is_internal`.

To test locally

1. Start backend and frontend dev servers:

```bash
# backend (already running in your environment)
cd backend
bun run start:dev

# frontend
cd frontend
npm run dev
```

2. Open the app in the browser, go to the Dashboard.
3. Click a case card — the comments panel should show the selected case title and its comments.
4. Click the `+` icon to open the add form, write a comment and submit.
5. Verify the comment appears in the list. Toggle `Shared` and `Internal` (if your user is a lawyer/admin) and verify visibility behavior by switching users/roles.

Debugging tips

- If the comments list is empty but you expect comments, check the network request to `/comments` and confirm the server returns the expected shape.
- If the add form does nothing, open the browser console — errors from the `Comment.create` call will be logged.
- Spinner shows while comments are loading (`isLoading` state). If the spinner never disappears, check for thrown errors in the `loadComments` catch block.

Extending

- To change visibility rules, update the `visibleComments` filtering logic inside `CommentsPannel.vue` (`loadComments` function).
- To add edit/delete features, implement `Comment.update(id, payload)` and `Comment.delete(id)` calls and wire them to UI controls.

Notes

- The component uses the locally provided `useToast` to show success/error messages. If you need richer toasts, replace the simple implementation in `frontend/src/components/ui/use-toast.js` with your app-wide toast system.
- The comments panel intentionally uses native `textarea` and `div` scroll areas to avoid dependency on custom UI components; you can swap in shared UI components if desired.

If you want, I can also add: a) edit/delete UI for comments, b) server-side bulk mark-read or c) unit tests for the comments service. Which would you prefer next?
