## Why

The frontend currently keeps overlapping copies of course and assignment data in multiple slice branches and then manually invalidates caches after mutations. This makes submission, profile, and progress updates harder to reason about, increases the risk of stale UI, and turns simple state changes into fragile cross-slice synchronization logic.

## What Changes

- Refactor the learning data store to use a normalized entity model for courses, assignments, and related records instead of duplicating the same assignment data across dashboard, course, and detail caches.
- Introduce Redux Toolkit entity adapters and selectors for learning entities so reads are derived from a single source of truth.
- Replace broad cache invalidation and manual patching helpers with targeted entity upserts/removals plus lightweight query status tracking.
- Ensure assignment and profile mutations update all affected screens consistently without requiring eager cache resets or redundant refetch coordination.
- Simplify thunk and selector contracts so feature pages request entities by id while shared selectors assemble dashboard, course, assignment, and progress views.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `client-state-and-request-feedback`: frontend state management requirements now include normalized entity storage and targeted mutation reconciliation instead of duplicated cache branches with manual invalidation.
- `learning-content-workspace`: learning pages must reflect assignment and related profile changes consistently across dashboard, course, assignment, and progress views after a successful mutation.

## Impact

- Frontend store modules in `mini-moodle-frontend/src/store/**/*`, especially `coursesSlice.ts`, `assignmentsSlice.ts`, shared thunks, selectors, and store wiring.
- Frontend domain types and selector usage in page/container components that currently depend on denormalized dashboard/course/assignment payload shapes.
- Redux Toolkit usage through `createEntityAdapter`, normalized selectors, and reduced mutation-side cache invalidation logic.
- No backend API contract changes are expected; the refactor is focused on frontend state handling and consistency behavior.
