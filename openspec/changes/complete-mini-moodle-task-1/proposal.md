## Why

The repository already contains a styled React frontend and a minimal Axum backend, but the assignment requires a fully working mini-Moodle application with typed client-server integration, Redux Toolkit state management, route guards, and real CRUD flows. Finishing the project now will turn the existing static layout into a buildable and demonstrably complete submission that matches the PDF requirements.

## What Changes

- Replace frontend mock-driven flows with typed API integration based on axios and Redux Toolkit.
- Implement registration, login, session restore, logout, and protected navigation with dedicated auth wrappers.
- Add the missing protected user-facing pages and connect the existing dashboard, course, and assignment screens to backend data.
- Introduce global request/loading/error handling so every backend call exposes visible progress and user-friendly error feedback.
- Expand the backend from the current template into a typed REST API that supports the data needed by the frontend and exercises GET, POST, PUT, PATCH, and DELETE.
- Ensure the app builds successfully, has a working not-found flow, and avoids duplicate initial requests.

## Capabilities

### New Capabilities
- `user-auth-and-session`: User registration, login, session lookup, logout, protected routes, and profile access for authenticated users.
- `learning-content-workspace`: Authenticated dashboard, profile page, course page, assignment page, and an additional progress/submission page backed by real server data.
- `client-state-and-request-feedback`: Redux Toolkit store layout, typed async data flow, request lifecycle tracking, modal error reporting, and shared wrapper components.
- `mini-moodle-rest-api`: Backend REST endpoints and typed payloads for auth, profile, courses, assignments, submissions/progress, and status updates.

### Modified Capabilities
- None.

## Impact

- Frontend: `mini-moodle-frontend/src/**/*`, router configuration, page components, shared UI behavior, and new store/api modules.
- Frontend dependencies: add Redux Toolkit, React Redux, axios, and supporting typings/utilities as needed.
- Backend: `mini-moodle-backend/src/**/*`, including routing, DTOs, error handling, auth/session handling, and in-memory or persistent application state.
- API contract: new JSON request/response models shared conceptually across frontend and backend.
- Delivery: build/start scripts must still work and the completed app must satisfy the assignment checklist from `React Task 1.pdf`.
