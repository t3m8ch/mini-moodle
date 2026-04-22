## Why

The frontend currently treats `AuthWrapper` as a private-route guard inside the route tree, while login, registration, and landing pages each carry separate auth decisions. That structure no longer matches the expected session-based routing behavior: all pages should participate in centralized auth flow, public pages should stay visible when appropriate, and protected API `401` responses should trigger a consistent redirect path.

## What Changes

- Rework frontend routing so `CommonWrapper` and `AuthWrapper` become global application wrappers instead of route-local wrappers embedded in the router configuration.
- Replace the current private-only `AuthWrapper` behavior with route-aware auth policy that classifies landing as public, login/register as guest-only, and dashboard/profile/course/assignment/progress pages as protected.
- Preserve landing page access for authenticated users while making its call-to-action state depend on session status.
- Move redirect ownership from individual auth pages into the centralized auth wrapper so login/register success updates session state and the wrapper redirects authenticated users away from guest-only routes.
- Add shared frontend support for session-expired handling so protected API `401` responses clear authenticated client state and redirect to `/login` through one navigation bridge used by Axios interceptors.
- Simplify the route module so it primarily describes pages/layouts, while auth/session policy lives in dedicated wrappers and auth utilities.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `user-auth-and-session`: route access rules must distinguish public, guest-only, and protected pages under cookie-backed session auth, including redirect behavior after session bootstrap and protected-request `401` failures.
- `client-state-and-request-feedback`: wrapper responsibilities must change so `CommonWrapper` and `AuthWrapper` wrap the full application, `AuthWrapper` owns centralized route redirects, and shared request handling covers auth/session-expired redirects triggered from Axios interceptors.

## Impact

- Frontend application composition in `mini-moodle-frontend/src/main.tsx`, `App.tsx`, and router setup.
- Wrapper components and route/layout structure in `mini-moodle-frontend/src/components/wrappers/` and routing modules.
- Auth/session Redux state, thunks, and page components that currently own redirect logic.
- Axios client/interceptor setup and shared navigation integration for session-expired flows.
