## Context

The current repository has two separate applications:
- `mini-moodle-frontend`: a Vite + React + TypeScript UI with static mock data, existing routes, and styled pages.
- `mini-moodle-backend`: an Axum service with only a hello route and stubbed auth handlers.

The assignment in `React Task 1.pdf` requires a real multi-page application with typed client-server communication, Redux Toolkit state management, route protection, visible request feedback, and usage of all HTTP verbs GET/POST/PUT/PATCH/DELETE. The change is cross-cutting because it touches routing, global frontend state, API contracts, backend state, and user experience rules.

Constraints:
- Keep TypeScript strict and avoid `any`/`never` in the frontend.
- Preserve the existing visual direction where practical instead of rewriting the UI from scratch.
- Keep the backend implementation realistic but lightweight enough to complete in one assignment cycle.
- Ensure protected pages fail gracefully with 401/403 behavior instead of frontend crashes or backend 500s.

## Goals / Non-Goals

**Goals:**
- Replace mock-only frontend behavior with typed API calls.
- Add Redux Toolkit and React Redux store structure that satisfies the assignment requirements.
- Implement `AuthWrapper` and `CommonWrapper` for auth control and global request/error presentation.
- Deliver all required pages: landing, login, register, profile, post-auth dashboard, course details, assignment details, and an extra progress/submissions page.
- Expand the backend into a usable REST API with session-based auth and seeded learning data.
- Use and demonstrate GET, POST, PUT, PATCH, and DELETE in real application flows.

**Non-Goals:**
- Building a production-grade LMS with persistent database storage.
- Supporting multiple user roles, file uploads, grading workflows, or admin tooling.
- Replacing the existing design system or introducing a full component-library migration.
- Implementing SSR, websocket updates, or advanced offline behavior.

## Decisions

### 1. Use an in-memory backend state with seeded demo data
**Decision:** Keep backend data in `Arc<RwLock<...>>` application state with seeded users, courses, assignments, and submissions/progress records.

**Rationale:** The backend currently has no database or migrations. In-memory state is enough to satisfy the assignment, enables all required HTTP methods, and avoids spending most of the work on infrastructure instead of requested app behavior.

**Alternatives considered:**
- **PostgreSQL with sqlx:** more realistic, but adds migration and environment complexity not required by the PDF.
- **JSON files on disk:** simple persistence, but introduces file IO edge cases and weaker concurrency semantics.

### 2. Use cookie-backed session auth from the backend and bootstrap `/auth/me` on the frontend
**Decision:** Authenticate with login/register endpoints that create a session token stored server-side and returned in an HTTP-only cookie. The frontend restores session state by calling `/auth/me` once during bootstrap.

**Rationale:** This maps naturally to the existing Axum stack, keeps the frontend simple, and makes route protection easy to express through a single current-user request.

**Alternatives considered:**
- **JWT in localStorage:** simpler backend, but weaker default security and unnecessary for this assignment.
- **Frontend-only mock auth:** does not satisfy the requirement for real backend integration.

### 3. Introduce a Redux Toolkit store with five slices
**Decision:** Organize client state into at least these slices:
- `userSlice` for session/authenticated user data
- `settingsSlice` for global loading/error/modal state
- `coursesSlice` for course lists and selected course data
- `assignmentsSlice` for assignment details and submission/progress data
- `profileSlice` for editable profile state

`settingsSlice` will react to async thunk lifecycle actions from other slices, and feature slices will reset on `user/logoutFulfilled` to satisfy the cross-slice interaction requirement.

**Rationale:** This meets the assignment requirement for Redux Toolkit, explicit user/settings stores, and cross-slice action usage while keeping responsibilities clear.

**Alternatives considered:**
- **Single large app slice:** simpler initially, but fails the assignment’s slice requirements and becomes hard to reason about.
- **Context API only:** does not satisfy the react-redux/RTK requirement.

### 4. Centralize HTTP logic in a typed axios client plus async thunks
**Decision:** Add an axios instance configured with base URL, credentials, and typed request helpers. Page-level and wrapper components will dispatch RTK async thunks instead of calling axios directly.

**Rationale:** This creates a single place for backend communication, supports typed DTOs, and makes it easy to coordinate loading/error UI via slice actions.

**Alternatives considered:**
- **Direct fetch usage inside components:** repetitive and harder to coordinate globally.
- **RTK Query:** valid technically, but the assignment explicitly asks for axios usage.

### 5. Map HTTP verbs to concrete user flows
**Decision:** The app will use each required method in an obvious user-facing flow:
- **GET**: session, profile, dashboard, courses, assignments, submissions/progress
- **POST**: register, login, create assignment submission
- **PUT**: update full profile data
- **PATCH**: update submission status or assignment progress metadata
- **DELETE**: logout session and remove/reset a submission draft when needed

**Rationale:** This avoids “dummy” endpoints and makes every verb observable during demo/testing.

**Alternatives considered:**
- Adding synthetic endpoints used nowhere in the UI, which would satisfy the checklist formally but not meaningfully.

### 6. Implement two wrappers with distinct responsibilities
**Decision:**
- `AuthWrapper` protects private routes, performs session bootstrap when needed, and redirects unauthenticated users to `/login`.
- `CommonWrapper` renders children together with the global loader and error modal/notification surface driven by `settingsSlice`.

**Rationale:** This aligns directly with the assignment language and prevents duplicated guard logic across pages.

**Alternatives considered:**
- Handling auth checks inside every page component, which is repetitive and harder to maintain.

## Risks / Trade-offs

- **[Risk] In-memory backend data resets on restart** → **Mitigation:** document it as intentional for the assignment and seed deterministic demo data at startup.
- **[Risk] Session bootstrap may trigger duplicate requests in React Strict Mode** → **Mitigation:** gate bootstrap thunks by explicit slice status and only dispatch when state is `idle`.
- **[Risk] Expanding the backend surface could cause inconsistent DTOs** → **Mitigation:** define response/request structs first and mirror them with TypeScript interfaces before wiring UI.
- **[Risk] Global loading UX may become noisy if every request blocks the whole app** → **Mitigation:** use a lightweight global indicator for navigation/request state and reserve modal UI for actual errors.
- **[Risk] Meeting the “extra pages” requirement may drift from the existing UI** → **Mitigation:** reuse the existing dashboard/course/assignment layout patterns and add one focused progress page rather than inventing unrelated screens.

## Migration Plan

1. Add frontend dependencies and create store/api/module structure.
2. Implement backend domain models, seeded state, error envelope, and REST routes under a stable API prefix.
3. Replace frontend mocks with async thunks and typed selectors.
4. Add wrappers and connect private routing.
5. Add the missing profile/progress pages and wire CRUD interactions.
6. Run frontend and backend build/test smoke checks and verify manual flows for all required pages and HTTP methods.

Rollback is straightforward during development: revert the change or temporarily switch frontend pages back to local mocks while backend work is in progress.

## Open Questions

- Whether logout should be implemented only as `DELETE /auth/session` or also exposed via a visible dedicated endpoint in the UI navigation.
- Whether assignment progress should be modeled as submission records only, or as a separate progress summary resource derived from submissions.
- Whether the profile page should be the same as the “personal cabinet” or remain a dedicated route in addition to the dashboard. Current plan: keep both, with dashboard as the main post-auth overview and profile as editable personal data.
