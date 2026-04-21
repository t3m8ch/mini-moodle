# mini-moodle-rest-api Specification

## Purpose
TBD - created by archiving change complete-mini-moodle-task-1. Update Purpose after archive.
## Requirements
### Requirement: The backend exposes typed JSON API contracts
The system SHALL expose typed request and response payloads for frontend-facing routes and SHALL return structured success and error envelopes.

#### Scenario: Successful API response
- **WHEN** a frontend request succeeds
- **THEN** the backend returns a typed JSON body that the TypeScript client can consume without `any`

#### Scenario: Failed API response
- **WHEN** a request cannot be completed
- **THEN** the backend returns a non-500 error status where appropriate together with a readable structured error payload

### Requirement: The backend supports all required HTTP verbs in real workflows
The system SHALL expose meaningful endpoints using GET, POST, PUT, PATCH, and DELETE to support the assignment flows.

#### Scenario: Frontend reads data with GET
- **WHEN** the frontend fetches session, profile, courses, assignments, or progress data
- **THEN** the backend returns HTTP 200 with the requested typed resources

#### Scenario: Frontend mutates data with POST, PUT, PATCH, and DELETE
- **WHEN** the frontend registers, logs in, updates profile data, updates submission/progress state, or clears session/submission data
- **THEN** the backend processes the corresponding POST, PUT, PATCH, and DELETE requests with appropriate status codes

### Requirement: Protected backend resources enforce authentication
The system SHALL require a valid authenticated session for private resources.

#### Scenario: Missing session on private API call
- **WHEN** a client calls a protected endpoint without a valid session
- **THEN** the backend returns 401 or 403 and does not return protected data

### Requirement: The backend provides deterministic seeded learning data
The system SHALL initialize predictable demo data so the frontend can render dashboard, course, assignment, and progress pages after startup.

#### Scenario: Demo content exists after startup
- **WHEN** the backend starts in the assignment environment
- **THEN** it exposes at least one demo user and related course, assignment, and progress data for end-to-end verification

