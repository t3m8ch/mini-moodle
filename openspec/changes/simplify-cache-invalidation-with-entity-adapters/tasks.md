## 1. Normalize learning state foundations

- [x] 1.1 Inventory the current duplicated learning state in `coursesSlice`, `assignmentsSlice`, thunks, and selectors, and define the target normalized state shape for courses, assignments, submissions, and view metadata
- [x] 1.2 Introduce Redux Toolkit entity adapters and helper utilities for learning entities, including typed ids/selectors needed to assemble dashboard, course, assignment, and progress view models
- [x] 1.3 Replace `coursesSlice` and `assignmentsSlice` with a single `learningSlice` so normalized learning entities and request metadata have one clear owner and remain compatible with the rest of the application

## 2. Refactor fetch flows to populate normalized entities

- [x] 2.1 Refactor dashboard fetch handling to upsert returned entities, preserve ordered dashboard ids, and expose the current dashboard view through selectors instead of denormalized payload storage
- [x] 2.2 Refactor course-detail and assignment-detail fetch handling to store canonical entities plus current selection metadata rather than embedded duplicated objects
- [x] 2.3 Refactor progress fetch handling so progress-related entities and ordering are normalized and can be rendered without storing conflicting copies of assignments/courses

## 3. Replace cache invalidation with targeted mutation reconciliation

- [x] 3.1 Refactor create/update submission reducers to reconcile normalized assignment/submission entities directly and remove manual multi-cache patching logic
- [x] 3.2 Refactor delete submission handling to clear or update the affected entities without resetting unrelated dashboard/course caches to `idle`
- [x] 3.3 Update profile-save reconciliation so dashboard and other dependent views read the updated user data from shared state without ad hoc cache mutation helpers

## 4. Migrate selectors and page consumers

- [x] 4.1 Replace selectors that read denormalized `dashboard`, `currentCourse`, `currentAssignment`, and `progress` branches with normalized view-model selectors
- [x] 4.2 Update dashboard, course, assignment, progress, and navigation consumers to use the new selectors while preserving current UX and routing behavior
- [x] 4.3 Remove obsolete invalidation helpers, duplicated cache lookup helpers, and the old `coursesSlice`/`assignmentsSlice` denormalized state fields once all consumers are migrated

## 5. Verify consistency and regression safety

- [x] 5.1 Add or update reducer/selector-focused tests for learning fetches and submission create/update/delete flows to verify cross-view consistency after mutation
- [x] 5.2 Run frontend build and targeted verification of dashboard, course, assignment, progress, and profile flows to confirm successful mutations no longer require manual cache invalidation to stay consistent
