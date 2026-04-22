## Context

The frontend already has working session-backed auth, `CommonWrapper`, `AuthWrapper`, Redux state, and protected page routes, but the current composition splits auth decisions across several layers. `CommonWrapper` and `AuthWrapper` are defined inside the router config, login/register pages still own redirect logic, landing is not auth-aware, and the Axios client has no shared session-expired redirect path. Because the backend uses HTTP-only session cookies instead of frontend-readable tokens, route access cannot be based on `localStorage` checks and must be driven by bootstrap state (`/auth/me`) plus protected-request `401` handling.

The desired direction is close to the already accepted peer project structure: a global app shell with `CommonWrapper`, a global `AuthWrapper`, plain route declarations, and centralized route policy. The difference is that this project must support cookie sessions, keep landing accessible for authenticated users, and allow Axios interceptors to trigger login redirects without duplicating page logic.

## Goals / Non-Goals

**Goals:**
- Make `App.tsx` the frontend composition root with `BrowserRouter`, `CommonWrapper`, `AuthWrapper`, and plain route declarations.
- Centralize route access policy in `AuthWrapper` for public, guest-only, and protected pages.
- Represent session bootstrap with a single explicit session state instead of multiple loosely related booleans.
- Keep landing accessible regardless of auth state, while letting login/register remain guest-only.
- Ensure successful login/register updates session state and lets `AuthWrapper` own the resulting redirect.
- Add a router-aware Axios interceptor bridge so protected API `401` responses clear session state and redirect to `/login` consistently.

**Non-Goals:**
- Changing backend auth from cookie sessions to bearer tokens.
- Reworking feature page data fetching beyond what is needed for auth/session coordination.
- Replacing the internal authenticated layout (`AppLayout`) or redesigning existing page UI.
- Introducing a larger routing abstraction than needed for the current app.

## Decisions

### 1. Use `BrowserRouter` + `Routes` and move wrappers out of route config
**Decision:** Replace the current `createBrowserRouter`/`RouterProvider` wrapper nesting with an `App.tsx` composition rooted in `BrowserRouter`, then render `CommonWrapper`, an Axios interceptor bridge, `AuthWrapper`, and plain `<Routes>` declarations.

**Rationale:** This mirrors the accepted project structure more closely, keeps wrapper responsibilities obvious, and removes router-level wrapper indirection. It also makes route declarations easier to read because the router module only expresses pages and layouts, not global policy.

**Alternatives considered:**
- **Keep `createBrowserRouter` and route-local wrappers:** works functionally, but preserves the current architectural complaint that auth/common policy lives inside route configuration.
- **Move `AuthWrapper` above the router entirely:** would require non-router navigation primitives and custom path subscriptions for route awareness, which adds unnecessary complexity after deciding to keep router hooks available.

### 2. Model route access with three route classes
**Decision:** Classify routes into three groups handled only by `AuthWrapper`:
- **Public:** `/`
- **Guest-only:** `/login`, `/register`
- **Protected:** `/dashboard`, `/profile`, `/courses/:courseId`, `/assignments/:assignmentId`, `/progress`

Landing remains accessible to authenticated users; guest-only pages redirect authenticated users to `/dashboard`; protected pages redirect guests to `/login`.

**Rationale:** This matches the expected behavior discussed with the reviewer while avoiding duplicated checks in individual pages.

**Alternatives considered:**
- **Only public vs protected:** not enough, because login/register need different behavior from landing.
- **Keep login/register redirect logic inside pages:** duplicates access control and weakens the role of the wrapper.

### 3. Use a single session state field for auth bootstrap
**Decision:** Store session lifecycle in one field such as `sessionStatus = 'unknown' | 'checking' | 'guest' | 'authenticated'`, with separate request status kept only for auth form submission UX if needed.

**Rationale:** With cookie-backed auth, the important question is the current session state, not whether a frontend-readable token exists. A single session state avoids invalid boolean combinations and makes wrapper decisions straightforward.

**Alternatives considered:**
- **`isAuthenticated` + `isInitialized`:** workable but easier to misuse and harder to reason about as state combinations grow.
- **One overloaded generic `status` for everything:** too ambiguous because bootstrap state and form submission state are different concerns.

### 4. Let `AuthWrapper` own route redirects after auth state changes
**Decision:** Login and register pages will submit credentials and update Redux auth/session state, but they will not own success redirects. Once the session state becomes `authenticated`, `AuthWrapper` will redirect from guest-only routes to `/dashboard`.

**Rationale:** This keeps route access decisions in one place and makes post-auth behavior a natural consequence of state changes instead of page-specific imperative navigation.

**Alternatives considered:**
- **Navigate inside `LoginPage` and `RegisterPage` after success:** simpler locally, but creates two competing places that can redirect based on auth.

### 5. Keep landing auth-aware without making it guest-only
**Decision:** The landing page will read centralized session state and vary its call to action based on whether the visitor is a guest or authenticated, while remaining accessible in both cases.

**Rationale:** This preserves the desired UX and avoids forcing authenticated users away from landing when they intentionally visit it.

**Alternatives considered:**
- **Redirect authenticated users away from landing:** simpler, but conflicts with the intended behavior.

### 6. Register Axios session-expired handling through a router-aware bridge
**Decision:** Add a small bridge component rendered inside `BrowserRouter` that obtains `navigate` (and, if useful, location context) from React Router and registers Axios response interceptors using shared auth/session helpers.

Protected-request `401` responses will:
- clear authenticated frontend state,
- avoid showing stale private UI,
- redirect to `/login` through the shared navigation bridge.

Bootstrap/auth endpoints such as `/auth/me`, `/auth/login`, and `/auth/register` will be excluded from this forced redirect path so normal guest/bootstrap failures do not create loops.

**Rationale:** This keeps interceptors compatible with React Router without mixing hooks directly into API modules.

**Alternatives considered:**
- **Use raw `window.location` redirects everywhere:** possible, but unnecessary once router hooks are available and less consistent with SPA navigation.
- **Skip interceptor-based redirects and rely only on page logic:** leaves expired-session handling fragmented and late.

### 7. Preserve `CommonWrapper` as the top-level shared UI shell
**Decision:** `CommonWrapper` remains above `AuthWrapper` and continues to own global loader/error/modal rendering, while `AuthWrapper` focuses only on session/bootstrap/access policy.

**Rationale:** This separation keeps request feedback concerns distinct from auth policy and aligns with the reviewer expectation that common UI state wraps the whole application.

**Alternatives considered:**
- **Merge wrappers:** reduces file count, but mixes unrelated responsibilities and makes auth flow harder to evolve.

## Risks / Trade-offs

- **[Risk] Switching from `RouterProvider` to `BrowserRouter` may remove current navigation-loading UI behavior** → **Mitigation:** preserve the existing global request indicator in `CommonWrapper` and only reintroduce route-transition polish if still needed after the refactor.
- **[Risk] Session bootstrap could still flash login/register briefly before redirecting** → **Mitigation:** make `AuthWrapper` block guest-only and protected routes while `sessionStatus` is `unknown`/`checking`, while allowing landing to render softly.
- **[Risk] Interceptor redirects could loop on auth endpoints** → **Mitigation:** explicitly exclude bootstrap/login/register endpoints and only redirect on protected-request `401` responses.
- **[Risk] Protected page state may remain visible after session expiration** → **Mitigation:** reset auth-dependent slices when session-expired handling marks the user as `guest`.
- **[Risk] Route classification for dynamic paths may drift from actual routes** → **Mitigation:** centralize route matching helpers and keep them near route declarations/tests.

## Migration Plan

1. Refactor frontend app composition so `App.tsx` becomes the wrapper and routing root using `BrowserRouter`.
2. Replace route-config wrappers with plain route/layout declarations and keep `AppLayout` only for authenticated shell pages.
3. Update auth Redux state to use explicit session lifecycle values and add any reset actions needed for session expiration.
4. Move auth success redirect ownership out of login/register pages and into `AuthWrapper`.
5. Make landing read session state and switch its CTA without forcing redirects.
6. Add the interceptor bridge and protected-request `401` handling.
7. Verify bootstrap, login, register, landing, protected navigation, logout, and session-expired scenarios.

Rollback remains straightforward during development: restore the previous router setup, remove the bridge/interceptor registration, and return page-owned redirects if the refactor needs to be reverted in stages.

## Open Questions

- Whether the login redirect after session expiration should preserve a `from` location for post-login return, or always send users to `/dashboard` after re-authentication.
- Whether `NotFoundPage` should be treated as fully public or should inherit any authenticated shell styling.
- Whether protected-slice reset on session expiration should clear all feature data immediately or only the slices that can expose private content.
