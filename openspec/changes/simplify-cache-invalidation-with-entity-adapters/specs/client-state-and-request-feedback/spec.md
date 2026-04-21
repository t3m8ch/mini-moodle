## MODIFIED Requirements

### Requirement: The frontend uses Redux Toolkit and React Redux for application state
The system SHALL manage frontend application state with Redux Toolkit and React Redux, and shared learning-domain entities SHALL be stored in normalized collections instead of duplicated cache branches for each screen.

#### Scenario: Store is initialized
- **WHEN** the frontend application starts
- **THEN** it creates a centralized store with typed slices for user, settings, and domain areas, and shared courses, assignments, and related learning records are represented through normalized entity state plus selectors that assemble screen-specific view models

## ADDED Requirements

### Requirement: Successful learning mutations reconcile shared entity state without broad cache invalidation
The system SHALL reconcile successful learning mutations by updating the normalized shared entities and view metadata directly, rather than resetting unrelated learning caches to force re-fetches.

#### Scenario: Submission mutation succeeds
- **WHEN** a submission is created, updated, or deleted successfully
- **THEN** the frontend updates the affected shared entities and any dependent views can render the new assignment state without first invalidating dashboard and course caches

#### Scenario: Request state is tracked independently from entities
- **WHEN** the frontend records loading, success, or error state for dashboard, course, assignment, or progress requests
- **THEN** that request metadata is stored separately from the normalized entities so a status reset does not erase or duplicate canonical learning data
