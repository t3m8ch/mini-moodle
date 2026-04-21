## Why

The current normalized `learningSlice` solved manual cache invalidation, but it replaced that complexity with a large shared state object and a growing set of reconciliation helpers that are hard to understand and maintain. For this project, the frontend will be simpler and easier to evolve if the backend becomes the primary source of truth again after mutations and the client store is organized around smaller feature/query concerns instead of one in-memory coordinator.

## What Changes

- Remove mutation-time reconciliation logic that manually synchronizes dashboard, course, assignment, and progress views inside a shared learning store.
- Replace the large unified learning state with smaller feature/query-oriented slices or state modules that track request lifecycle and the latest backend responses for each screen.
- Refetch the affected read models from the backend after create/update/delete submission flows instead of trying to fully repair all dependent frontend views in memory.
- Simplify selectors and reducer helpers so each page reads from a smaller local state shape and cross-view consistency comes from fresh server data.
- Preserve existing user-visible learning flows and backend contracts while reducing frontend state-management complexity.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `client-state-and-request-feedback`: frontend state management requirements now favor simpler query/feature state and post-mutation refetch over broad in-memory reconciliation of a shared learning store.
- `learning-content-workspace`: learning pages must stay consistent after submission and profile mutations by reloading the affected backend-backed views rather than relying on manual cross-view state repair.

## Impact

- Frontend store modules in `mini-moodle-frontend/src/store/**/*`, especially the current `learningSlice`, selectors, thunks, and store composition.
- Page containers for dashboard, course, assignment, progress, and profile flows that currently depend on a shared normalized learning state.
- Mutation flows for submission create/update/delete and profile save, which will refetch affected read models after success.
- No backend API changes are expected; this change is focused on simplifying frontend state ownership and request orchestration.
