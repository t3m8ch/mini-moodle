## ADDED Requirements

### Requirement: Guest-only auth pages reject authenticated users
The system SHALL treat login and registration pages as guest-only routes so authenticated users are redirected to the post-auth workspace instead of re-entering auth forms.

#### Scenario: Authenticated user opens login page
- **WHEN** an authenticated user navigates to `/login`
- **THEN** the frontend redirects the user to `/dashboard` through centralized auth-wrapper route policy

#### Scenario: Authenticated user opens registration page
- **WHEN** an authenticated user navigates to `/register`
- **THEN** the frontend redirects the user to `/dashboard` through centralized auth-wrapper route policy

### Requirement: Landing stays available for both guests and authenticated users
The system SHALL keep the landing page publicly accessible while adapting its call to action to the current session state.

#### Scenario: Guest opens landing
- **WHEN** a guest navigates to `/`
- **THEN** the landing page renders and exposes entry points for login and registration

#### Scenario: Authenticated user opens landing
- **WHEN** an authenticated user navigates to `/`
- **THEN** the landing page renders without redirecting away and exposes authenticated navigation instead of guest-only auth calls to action

## MODIFIED Requirements

### Requirement: Users can log in and restore an existing session
The system SHALL allow registered users to log in and SHALL restore an existing session through a dedicated current-user request that drives centralized frontend session state.

#### Scenario: Login succeeds
- **WHEN** a registered user submits valid login credentials
- **THEN** the backend establishes a session, the frontend updates centralized session state to authenticated, and centralized route policy transitions the user to authenticated content

#### Scenario: Session restore succeeds on startup
- **WHEN** the frontend starts with a valid session cookie present
- **THEN** it performs a single current-user request, hydrates the authenticated user state, and applies route behavior for the current page based on the restored session

### Requirement: Protected routes require authentication
The system SHALL prevent unauthenticated users from accessing private pages such as dashboard, profile, courses, assignments, and progress, using centralized route policy plus protected-request session-expired handling.

#### Scenario: Guest opens a private page
- **WHEN** an unauthenticated visitor navigates to a protected route
- **THEN** the app performs any required session bootstrap check and redirects the visitor to the login page instead of rendering private content

#### Scenario: Authenticated user opens a private page
- **WHEN** an authenticated user navigates to a protected route
- **THEN** the route renders successfully with HTTP 200 responses for the required data requests

#### Scenario: Session expires during a protected request
- **WHEN** a protected backend request responds with 401 for a user who was previously on private content
- **THEN** the frontend clears authenticated client state and redirects the user to the login page
