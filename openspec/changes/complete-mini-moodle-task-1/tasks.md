## 1. Backend API foundation

- [x] 1.1 Define backend domain models, DTOs, seeded demo data, and shared application state for users, courses, assignments, and submissions/progress
- [x] 1.2 Implement structured API success/error responses with proper 401/403/404 handling instead of `todo!()` fallbacks
- [x] 1.3 Add auth/session endpoints for register, login, current user, and logout using cookie-backed session state
- [x] 1.4 Add protected REST endpoints for profile, dashboard/course data, assignment details, progress/submissions, and the required GET/POST/PUT/PATCH/DELETE flows

## 2. Frontend infrastructure and state management

- [x] 2.1 Add frontend dependencies and create typed API client modules based on axios
- [x] 2.2 Create Redux Toolkit store setup with `user`, `settings`, `courses`, `assignments`, and `profile` slices plus typed hooks/selectors
- [x] 2.3 Implement async thunks and cross-slice interactions so loading/error/reset state reacts to auth and data actions
- [x] 2.4 Remove direct reliance on local mock data in pages that will be backed by server responses

## 3. Routing, wrappers, and page integration

- [x] 3.1 Implement `CommonWrapper` for global loading/error presentation driven by shared settings state
- [x] 3.2 Implement `AuthWrapper` for protected route gating and single-run session bootstrap
- [x] 3.3 Update router/layout configuration so landing, login, register, dashboard, profile, course, assignment, progress, and not-found pages follow the required public/private behavior
- [x] 3.4 Connect login, registration, logout, and profile edit forms to typed backend actions

## 4. Learning flows and CRUD interactions

- [x] 4.1 Connect dashboard and course pages to live course/assignment data from the backend
- [x] 4.2 Connect assignment details to submission creation and status update flows using POST and PATCH
- [x] 4.3 Add the additional authenticated progress/submissions page and wire DELETE behavior for clearing a submission draft or session-related data
- [x] 4.4 Ensure failed protected requests surface readable 401/403/404 outcomes without crashes and that loading states are visible for every request

## 5. Assignment compliance and verification

- [x] 5.1 Verify that all required HTTP methods are exercised from the frontend against real backend endpoints
- [x] 5.2 Verify that protected pages require authentication, the 404 page is reachable, and startup does not cause duplicate identical bootstrap requests
- [x] 5.3 Run project build checks for frontend and backend, fix integration issues, and confirm the repository is ready for assignment demonstration
