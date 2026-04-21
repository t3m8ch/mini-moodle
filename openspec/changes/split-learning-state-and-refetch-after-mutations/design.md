## Context

The current frontend was recently refactored toward a single normalized `learningSlice` with entity adapters and in-memory reconciliation across dashboard, course, assignment, and progress views. That removed explicit cache invalidation, but it also introduced a large shared state shape, relation maps, and reducer helpers that try to keep several read models synchronized after each mutation.

For this mini-Moodle application, that level of client-side coordination is more complexity than value. The backend already returns the exact read models each page needs, and the app has a small number of learning pages. A simpler design is to let successful mutations trigger targeted refetches of affected read models and keep frontend slices oriented around features or queries instead of a single client-side learning database.

Constraints:
- Keep Redux Toolkit and React Redux in use.
- Preserve current user-visible behavior and backend API contracts.
- Maintain visible loading and error handling through existing shared settings/wrapper infrastructure.
- Avoid reintroducing stale cross-page behavior after submission and profile changes.

## Goals / Non-Goals

**Goals:**
- Remove mutation-time reconciliation helpers that manually repair several learning views in memory.
- Replace the large shared `learningSlice` with smaller feature/query-oriented slices or state modules with simpler shapes.
- Use post-mutation refetch of affected backend read models to keep dashboard, course, assignment, progress, and profile views consistent.
- Keep selectors and page code straightforward by aligning client state with backend response shapes where practical.
- Preserve existing flows for dashboard, course detail, assignment detail, progress, and profile editing.

**Non-Goals:**
- Changing backend endpoints, payload formats, or authentication behavior.
- Removing Redux Toolkit, React Redux, or the shared settings slice.
- Introducing RTK Query or a new data-fetching library in this change.
- Redesigning pages or adding new learning features.

## Decisions

### 1. Prefer smaller feature/query slices over one shared learning slice
**Decision:** Replace the current single `learningSlice` with smaller slices or modules organized around read models such as dashboard, course detail, assignment detail, progress, and profile-related learning dependencies.

**Rationale:** Once mutation reconciliation is removed, the main reason for a single shared learning owner disappears. Smaller slices make state shapes easier to read, localize reducer logic, and reduce the amount of global coupling required to understand a single screen.

**Alternatives considered:**
- **Keep `learningSlice` and only nest its state more cleanly:** improves readability, but still preserves a broad shared ownership model we no longer need.
- **Keep `learningSlice` and simply remove some helpers:** simpler than a split, but still leaves one large slice responsible for too many views.

### 2. Use backend refetch after successful mutations instead of in-memory reconciliation
**Decision:** After successful submission create/update/delete and profile save flows, dispatch the minimal set of follow-up read requests needed to refresh affected views from the backend.

**Rationale:** The backend is already the source of truth for dashboard, assignment, course, progress, and profile data. Refetching those read models is easier to reason about than updating several frontend caches by hand.

**Alternatives considered:**
- **Continue in-memory reconciliation:** fewer requests, but much more reducer complexity and a higher risk of subtle stale-state bugs.
- **Refetch every learning view after every mutation:** correct but unnecessarily noisy; the implementation should target only impacted views.

### 3. Align slice state more closely with backend response shapes
**Decision:** Store page/query responses in shapes close to the backend payloads instead of aggressively normalizing them into entity adapters and relation maps.

**Rationale:** For a small app with a handful of views, response-shaped state is easier to inspect and update. It lowers the mental cost of understanding what each page depends on and reduces the need for complex selector reconstruction.

**Alternatives considered:**
- **Keep normalized entities with lighter helpers:** still pays the complexity cost of normalized ownership while intentionally giving up the main benefit of in-memory synchronization.

### 4. Keep cross-slice behavior only for request lifecycle and resets
**Decision:** Retain cross-slice interaction where it is already valuable: shared loading/error tracking in `settingsSlice`, auth-driven resets on logout, and explicit invalidation-by-refetch orchestration in thunks or page handlers.

**Rationale:** Not all cross-slice behavior is bad. Request lifecycle and auth resets are legitimate global concerns. The complexity to remove is domain reconciliation, not all cooperation between slices.

**Alternatives considered:**
- **Move everything into isolated local component state:** would violate existing Redux requirements and reduce shared control over loading/error UX.

## Risks / Trade-offs

- **[Risk] More network requests after mutations may slow perceived responsiveness** → **Mitigation:** refetch only affected views and keep global loading UI lightweight.
- **[Risk] Refetch orchestration may still become scattered if done ad hoc in components** → **Mitigation:** centralize follow-up request patterns in thunks or small helper flows.
- **[Risk] Splitting state by feature can reintroduce duplicated payload shapes** → **Mitigation:** accept small, intentional duplication when it keeps ownership simple and avoid rebuilding a hidden shared cache.
- **[Risk] Some pages may briefly show stale data until refetch completes** → **Mitigation:** trigger follow-up reads immediately after successful mutation and preserve clear loading indicators.
- **[Trade-off] The app gives up some client-side cleverness** → **Mitigation:** favor maintainability over aggressive local synchronization for this project size.

## Migration Plan

1. Identify the current learning views and define smaller replacement slices/state modules and their response-shaped state.
2. Move dashboard, course, assignment, and progress fetch handling out of the shared `learningSlice` into the new feature/query slices.
3. Rewrite submission and profile mutation flows so they trigger targeted post-success refetches instead of reducer-level reconciliation.
4. Simplify selectors and page consumers to read from the new smaller state shapes.
5. Remove obsolete reconciliation helpers, relation maps, entity adapters, and the old shared learning state.
6. Run build/tests and verify that dashboard, course, assignment, progress, and profile views stay consistent after mutations.

Rollback is straightforward: the change is frontend-only and can be reverted to the existing shared learning store if the split introduces regressions.

## Open Questions

- Which exact slices should own the simplified read models: screen-specific slices (`dashboard`, `course`, `assignment`, `progress`) or a smaller two-slice split such as `courses` and `assignments`?
- Should post-mutation refetch orchestration live in thunks, page handlers, or small domain helpers called by thunks?
- Is it worth keeping any normalized entity state at all for navigation helpers, or should the app rely entirely on response-shaped query state?
