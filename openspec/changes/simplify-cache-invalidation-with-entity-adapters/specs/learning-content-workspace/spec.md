## MODIFIED Requirements

### Requirement: Users can access and update their profile page
The system SHALL provide a dedicated profile page where authenticated users can review and update their personal information, and successful profile changes SHALL propagate to other dependent learning views that display the same user data.

#### Scenario: Profile page loads
- **WHEN** an authenticated user opens the profile page
- **THEN** the app displays the current typed user profile returned by the backend

#### Scenario: Profile update succeeds
- **WHEN** an authenticated user submits a valid profile edit
- **THEN** the frontend sends a PUT request, the backend stores the new profile data, and the profile and dashboard views both reflect the updated information without requiring a manual refresh

### Requirement: Users can inspect assignments and manage a submission/progress record
The system SHALL provide an assignment page that shows assignment details and allows the user to create or update a submission/progress entry, and successful changes SHALL stay consistent across the other learning views that reference the same assignment.

#### Scenario: Submission is created
- **WHEN** an authenticated user submits assignment notes for the first time
- **THEN** the frontend sends a POST request, the backend stores a new submission/progress record, and dashboard, course, assignment, and progress views can all render the resulting assignment state consistently

#### Scenario: Submission status is updated
- **WHEN** an authenticated user updates the state of an existing submission or progress record
- **THEN** the frontend sends a PATCH request, the backend returns the updated typed entity, and every learning view that references that assignment reflects the same status after reconciliation

## ADDED Requirements

### Requirement: Learning views remain internally consistent after successful mutations
The system SHALL keep dashboard, course, assignment, and progress pages synchronized after successful learning mutations so the user does not encounter conflicting assignment states across pages.

#### Scenario: User navigates between views after a mutation
- **WHEN** a user creates, updates, or deletes a submission and then opens another learning page that references the same assignment
- **THEN** the destination page shows the reconciled assignment state from shared frontend data instead of stale pre-mutation values
