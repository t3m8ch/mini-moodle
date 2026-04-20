## ADDED Requirements

### Requirement: Authenticated users can view a dashboard of learning data
The system SHALL provide a post-auth dashboard page that shows the authenticated user's relevant learning data fetched from the backend.

#### Scenario: Dashboard loads
- **WHEN** an authenticated user opens the dashboard page
- **THEN** the frontend requests typed course and assignment summary data and renders the overview without relying on hard-coded mocks

### Requirement: Users can access and update their profile page
The system SHALL provide a dedicated profile page where authenticated users can review and update their personal information.

#### Scenario: Profile page loads
- **WHEN** an authenticated user opens the profile page
- **THEN** the app displays the current typed user profile returned by the backend

#### Scenario: Profile update succeeds
- **WHEN** an authenticated user submits a valid profile edit
- **THEN** the frontend sends a PUT request, the backend stores the new profile data, and the UI reflects the updated information

### Requirement: Users can inspect course details and related assignments
The system SHALL provide a course page that shows course metadata and the assignments associated with the selected course.

#### Scenario: Course page loads
- **WHEN** an authenticated user opens a specific course page
- **THEN** the app renders the selected course information and its related assignments from backend data

### Requirement: Users can inspect assignments and manage a submission/progress record
The system SHALL provide an assignment page that shows assignment details and allows the user to create or update a submission/progress entry.

#### Scenario: Submission is created
- **WHEN** an authenticated user submits assignment notes for the first time
- **THEN** the frontend sends a POST request and the backend stores a new submission/progress record

#### Scenario: Submission status is updated
- **WHEN** an authenticated user updates the state of an existing submission or progress record
- **THEN** the frontend sends a PATCH request and the backend returns the updated typed entity

### Requirement: Users can access an additional progress page
The system SHALL provide an additional authenticated page that lists the user's submission or progress history across assignments.

#### Scenario: Progress page loads
- **WHEN** an authenticated user opens the progress page
- **THEN** the app renders a typed list of submission/progress entries linked to assignments and courses
