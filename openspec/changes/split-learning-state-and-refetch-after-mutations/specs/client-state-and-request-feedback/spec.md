## MODIFIED Requirements

### Requirement: The frontend uses Redux Toolkit and React Redux for application state
The system SHALL manage frontend application state with Redux Toolkit and React Redux, and learning-related state SHALL be organized into simple feature/query-oriented slices or modules instead of one large shared reconciliation-heavy learning store.

#### Scenario: Store is initialized
- **WHEN** the frontend application starts
- **THEN** it creates a centralized store with typed slices for user, settings, and additional domain areas, and the learning pages read from smaller response-shaped feature/query state rather than a single large in-memory coordinator for all learning views

## ADDED Requirements

### Requirement: Successful learning mutations refresh affected views from the backend
The system SHALL keep learning views consistent after successful mutations by refetching the affected backend read models instead of manually reconciling all related frontend views in memory.

#### Scenario: Submission mutation succeeds
- **WHEN** a submission is created, updated, or deleted successfully
- **THEN** the frontend triggers follow-up requests for the affected learning views so later rendering reflects fresh backend data without broad reducer-level reconciliation

#### Scenario: Profile mutation succeeds
- **WHEN** the authenticated user saves profile changes successfully
- **THEN** the frontend refreshes any affected profile or dashboard read models from the backend so dependent views display consistent user information
