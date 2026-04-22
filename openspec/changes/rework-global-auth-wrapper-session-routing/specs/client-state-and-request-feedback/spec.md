## MODIFIED Requirements

### Requirement: The frontend provides AuthWrapper and CommonWrapper components
The system SHALL use two wrapper components to centralize app-wide request-state rendering and app-wide auth/session route policy.

#### Scenario: CommonWrapper wraps the whole application
- **WHEN** the frontend application renders
- **THEN** CommonWrapper surrounds the routed page tree and renders shared loading, modal, and error feedback for every page

#### Scenario: AuthWrapper classifies route access centrally
- **WHEN** any routed page is rendered
- **THEN** AuthWrapper determines whether the route is public, guest-only, or protected and applies the corresponding auth/session behavior before allowing the child page to continue

### Requirement: Every backend request exposes visible loading and error feedback
The system SHALL provide user-visible loading state for each backend request, SHALL present a readable error surface when a request fails, and SHALL redirect away from stale private content when protected requests lose session auth.

#### Scenario: Request is loading
- **WHEN** the frontend sends a request to the backend
- **THEN** the UI shows a loading indicator controlled by shared state until the request resolves

#### Scenario: Request fails
- **WHEN** the backend responds with a non-200 status or a network error occurs
- **THEN** the UI shows a readable error message instead of silently failing or crashing

#### Scenario: Protected request returns unauthorized
- **WHEN** a protected backend request returns 401 because the session is no longer valid
- **THEN** shared request handling clears authenticated state and redirects the user to the login page instead of leaving stale private content visible

### Requirement: Bootstrap requests avoid duplicate execution
The system SHALL prevent repeated identical bootstrap requests during normal application start and route transitions, while still allowing public landing rendering and blocking only the routes that require resolved session state.

#### Scenario: Session bootstrap runs once for a guarded startup path
- **WHEN** the application initializes authenticated state for a guest-only or protected route
- **THEN** the current-user bootstrap request is dispatched once for that startup path rather than duplicated by wrapper render logic

#### Scenario: Landing renders while session state resolves
- **WHEN** the application opens on the landing page before session bootstrap has completed
- **THEN** the landing page can render without duplicate bootstrap requests and later adapts its visible actions when the session state resolves
