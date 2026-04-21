## ADDED Requirements

### Requirement: Users can register with typed profile data
The system SHALL provide a registration flow that accepts typed user profile fields and creates a new authenticated account or a clear validation error.

#### Scenario: Successful registration
- **WHEN** a visitor submits valid registration data with name, email, and password
- **THEN** the backend creates the user account, returns a typed success payload, and establishes an authenticated session

#### Scenario: Duplicate registration is rejected
- **WHEN** a visitor submits an email that already exists
- **THEN** the backend returns a non-200 error response with a readable message and the frontend shows the error through the common error feedback flow

### Requirement: Users can log in and restore an existing session
The system SHALL allow registered users to log in and SHALL restore an existing session through a dedicated current-user request.

#### Scenario: Login succeeds
- **WHEN** a registered user submits valid login credentials
- **THEN** the backend establishes a session and the frontend transitions the user to authenticated content

#### Scenario: Session restore succeeds
- **WHEN** the frontend starts with a valid session cookie present
- **THEN** it performs a single current-user request and hydrates the authenticated user state without requiring a new login

### Requirement: Protected routes require authentication
The system SHALL prevent unauthenticated users from accessing private pages such as dashboard, profile, courses, assignments, and progress.

#### Scenario: Guest opens a private page
- **WHEN** an unauthenticated visitor navigates to a protected route
- **THEN** the app redirects the visitor to the login page and the protected backend request returns 401 or 403 instead of 500

#### Scenario: Authenticated user opens a private page
- **WHEN** an authenticated user navigates to a protected route
- **THEN** the route renders successfully with HTTP 200 responses for the required data requests

### Requirement: Users can log out cleanly
The system SHALL allow authenticated users to end their session and clear private client state.

#### Scenario: Logout succeeds
- **WHEN** an authenticated user triggers logout
- **THEN** the backend invalidates the session, the frontend clears protected state, and subsequent private navigation requires login again
