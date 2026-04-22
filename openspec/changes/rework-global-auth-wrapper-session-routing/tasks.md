## 1. Restructure the app shell and route declarations

- [x] 1.1 Replace the current `RouterProvider`-based composition with an `App.tsx` root that uses `BrowserRouter`, `CommonWrapper`, `AuthWrapper`, and plain route declarations
- [x] 1.2 Move `CommonWrapper` and `AuthWrapper` out of the router configuration so the route module only declares pages, layouts, and fallbacks
- [x] 1.3 Preserve the authenticated page shell by keeping `AppLayout` around protected pages inside the simplified route tree

## 2. Rework centralized auth/session state

- [x] 2.1 Refactor auth state to use a single explicit session lifecycle field for bootstrap and access decisions under cookie-backed session auth
- [x] 2.2 Update the current-user bootstrap thunk and related reducers so guarded startup paths resolve session state once without duplicate bootstrap dispatches
- [x] 2.3 Add or update logout/session-expired reset behavior so protected client state is cleared when auth becomes guest again

## 3. Implement route-aware wrapper behavior

- [x] 3.1 Update `AuthWrapper` to classify public, guest-only, and protected routes, including dynamic protected paths such as courses and assignments
- [x] 3.2 Make `AuthWrapper` allow landing to render for both guests and authenticated users while blocking guest-only/protected routes until session bootstrap resolves
- [x] 3.3 Remove page-owned auth redirects from login and register flows so successful auth updates session state and `AuthWrapper` redirects authenticated users away from guest-only pages
- [x] 3.4 Make the landing page read centralized session state and switch its visible call to action based on whether the visitor is a guest or authenticated

## 4. Add shared session-expired request handling

- [x] 4.1 Introduce a router-aware Axios interceptor bridge that registers navigation-capable response interceptors inside the app shell
- [x] 4.2 Handle protected-request `401` responses by clearing authenticated state and redirecting to `/login` while excluding bootstrap/login/register endpoints from forced redirect behavior
- [x] 4.3 Ensure global loading and error handling still works with the new wrapper/interceptor flow and does not surface session-expired protected requests as stale private UI

## 5. Verify auth and routing scenarios

- [x] 5.1 Add or update frontend tests covering landing access, guest-only redirects, protected-route guards, and post-login/register wrapper-driven redirects
- [x] 5.2 Add or update tests for session bootstrap and protected-request `401` handling so expired sessions redirect cleanly to `/login`
- [ ] 5.3 Run frontend build/tests and perform manual verification of landing, login, register, dashboard, logout, and session-expired navigation flows
