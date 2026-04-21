## MODIFIED Requirements

### Requirement: Users can access and update their profile page
The system SHALL provide a dedicated profile page where authenticated users can review and update their personal information, and successful profile changes SHALL be reflected by reloading the affected backend-backed views.

#### Scenario: Profile page loads
- **WHEN** an authenticated user opens the profile page
- **THEN** the app displays the current typed user profile returned by the backend

#### Scenario: Profile update succeeds
- **WHEN** an authenticated user submits a valid profile edit
- **THEN** the frontend sends a PUT request, the backend stores the new profile data, and the profile and dashboard views refresh from backend data so both surfaces show the updated information

### Requirement: Users can inspect assignments and manage a submission/progress record
The system SHALL provide an assignment page that shows assignment details and allows the user to create or update a submission/progress entry, and successful changes SHALL be reflected across learning views by reloading affected backend-backed data.

#### Scenario: Submission is created
- **WHEN** an authenticated user submits assignment notes for the first time
- **THEN** the frontend sends a POST request, the backend stores a new submission/progress record, and the affected assignment, progress, and other dependent learning views reload fresh data from the backend

#### Scenario: Submission status is updated
- **WHEN** an authenticated user updates the state of an existing submission or progress record
- **THEN** the frontend sends a PATCH request, the backend returns the updated typed entity, and the affected learning views refresh so they all reflect the new backend state

## ADDED Requirements

### Requirement: Learning views remain consistent through post-mutation reloads
The system SHALL keep dashboard, course, assignment, and progress pages consistent after successful mutations by reloading the affected views instead of relying on manual in-memory reconciliation.

#### Scenario: User navigates between views after a mutation
- **WHEN** a user creates, updates, or deletes a submission and then opens another learning page that references the same data
- **THEN** the destination page shows the refreshed backend-backed state rather than stale pre-mutation values from a shared reconciled cache
