# client-state-and-request-feedback Specification

## Purpose
TBD - created by archiving change complete-mini-moodle-task-1. Update Purpose after archive.
## Requirements
### Requirement: The frontend uses Redux Toolkit and React Redux for application state
The system SHALL manage frontend application state with Redux Toolkit and React Redux instead of component-local mocks alone.

#### Scenario: Store is initialized
- **WHEN** the frontend application starts
- **THEN** it creates a centralized store with typed slices for user, settings, and at least three additional domain areas

### Requirement: At least one slice reacts to another slice's actions
The system SHALL include cross-slice behavior so that one slice depends on or reacts to another slice's actions.

#### Scenario: Global state reacts to auth lifecycle
- **WHEN** auth-related async actions are pending, fulfilled, rejected, or logout completes
- **THEN** another slice updates loading/error/reset state in response to those actions

### Requirement: The frontend provides AuthWrapper and CommonWrapper components
The system SHALL use two wrapper components to centralize auth control and common request-state rendering.

#### Scenario: AuthWrapper protects private routes
- **WHEN** a protected route is rendered
- **THEN** AuthWrapper checks the authenticated session state before allowing access to the child page

#### Scenario: CommonWrapper exposes shared UI state
- **WHEN** global loading or error state changes
- **THEN** CommonWrapper renders the configured loading indicator or error feedback around the page content

### Requirement: Every backend request exposes visible loading and error feedback
The system SHALL provide user-visible loading state for each backend request and SHALL present a readable error surface when a request fails.

#### Scenario: Request is loading
- **WHEN** the frontend sends a request to the backend
- **THEN** the UI shows a loading indicator controlled by shared state until the request resolves

#### Scenario: Request fails
- **WHEN** the backend responds with a non-200 status or a network error occurs
- **THEN** the UI shows a readable error message instead of silently failing or crashing

### Requirement: Bootstrap requests avoid duplicate execution
The system SHALL prevent repeated identical bootstrap requests during normal application start and route transitions.

#### Scenario: Session bootstrap runs once
- **WHEN** the application initializes authenticated state
- **THEN** the current-user bootstrap request is dispatched once per startup path rather than duplicated by render logic

