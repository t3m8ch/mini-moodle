## Context

The current frontend keeps denormalized learning data in multiple places:
- `coursesSlice` stores `dashboard.recentAssignments` and `currentCourse.assignments`
- `assignmentsSlice` stores `currentAssignment.assignment`
- `assignmentsSlice.progress` also carries embedded course/assignment data

Because the same assignment appears in several branches, mutation handlers manually patch some copies and then reset multiple status flags to `idle` with `invalidateLearningCaches`. This mixes entity updates, cache lifecycle, and view recomputation in slice reducers. It also makes the data flow harder to extend: every new mutation must remember which caches to patch, which statuses to invalidate, and which pages depend on those copies.

The requested refactor is cross-cutting because it changes state shape, reducers, selectors, and the way page components read data. Backend responses can remain unchanged, but the frontend needs an internal normalization layer that turns API payloads into a single source of truth.

## Goals / Non-Goals

**Goals:**
- Replace duplicated assignment and course copies with normalized entity state built on Redux Toolkit entity adapters.
- Keep request status tracking separate from entity storage so mutation reducers no longer need broad cache invalidation helpers.
- Make assignment mutations update dashboard, course, assignment-detail, and progress screens from the same entities.
- Preserve existing backend API contracts and page behavior while simplifying reducer logic and selector composition.
- Create selectors that derive dashboard, course-detail, assignment-detail, and progress view models from normalized entities plus lightweight view metadata.

**Non-Goals:**
- Replacing axios, async thunks, or the overall Redux Toolkit architecture.
- Changing backend endpoints or response semantics.
- Redesigning page layouts or rewriting unrelated auth/settings/profile logic.
- Introducing RTK Query or a second caching abstraction in the same refactor.

## Decisions

### 1. Introduce a dedicated normalized `learningSlice` backed by entity adapters
**Decision:** Consolidate learning-domain state into a single `learningSlice` that stores courses, assignments, and submissions/progress entries in normalized collections using `createEntityAdapter`, and keep only ids plus request metadata for dashboard, course, assignment, and progress views.

**Rationale:** The current complexity comes from splitting one domain across `coursesSlice` and `assignmentsSlice`, while both slices effectively own overlapping assignment data. A single `learningSlice` makes ownership explicit: one reducer owns canonical learning entities and reconciles mutations for all dependent views. Entity adapters then fit naturally, because the same assignment can be referenced from multiple screens without duplicating the object.

**Alternatives considered:**
- **Keep the current slice split and add more helper functions:** reduces some duplication but preserves unclear ownership and cross-slice synchronization.
- **Keep separate slices but share a normalized core module:** safer incrementally, but still leaves learning state boundaries less obvious and easier to regress.
- **Normalize only assignments:** helps partly, but course/progress relationships would still require embedded copies and special-case synchronization.

### 2. Separate entity state from view/query state
**Decision:** Represent screen-specific state as lightweight metadata, for example dashboard course ids, dashboard recent assignment ids, current course id, current assignment id, and per-view request status/error fields.

**Rationale:** The current reducers couple fetched payloads with entity storage and status invalidation. Splitting them allows reducers to update entities without implicitly forcing refetches. Selectors can build the exact view shape each page expects from ids + entities.

**Alternatives considered:**
- **Keep full API payloads in state and derive only some fragments:** simpler migration, but still leaves denormalized payloads that need invalidation.
- **Store no view metadata and always recompute from all entities:** loses ordering and context returned by the backend, especially for dashboard-specific lists.

### 3. Normalize API payloads at thunk/reducer boundaries, not in components
**Decision:** Convert dashboard, course-detail, assignment-detail, and progress responses into entity upserts inside slice reducers or small normalization helpers used by reducers.

**Rationale:** Components should consume selectors, not know how raw payloads map into the store. This keeps the normalization strategy centralized and testable.

**Alternatives considered:**
- **Normalize in components:** spreads domain rules across pages and defeats the refactor.
- **Normalize inside API client layer:** makes API helpers too store-aware and harder to reuse.

### 4. Replace cache invalidation with targeted mutation reconciliation
**Decision:** On create/update/delete submission flows, update the normalized assignment/submission entities immediately and only reset request state where a real refetch is necessary.

**Rationale:** The current `invalidateLearningCaches` helper resets unrelated statuses after every mutation, which hides consistency problems by forcing follow-up fetches. With normalized entities, most successful mutations should already leave the UI correct without resetting dashboard/course caches.

**Alternatives considered:**
- **Continue invalidating and refetching all impacted views:** simpler short term, but keeps unnecessary network churn and complex reducer coupling.
- **Optimistic updates for every mutation:** possible later, but unnecessary for this refactor; server-confirmed updates are enough.

### 5. Keep existing page contracts stable through selectors during migration
**Decision:** Preserve current page-level data expectations where practical by introducing selectors that return dashboard/course/assignment/progress view models compatible with the current components.

**Rationale:** This reduces migration risk. The store can be substantially improved without forcing a simultaneous rewrite of every presentation component.

**Alternatives considered:**
- **Rewrite all pages to consume ids/entities directly:** cleaner long term, but larger blast radius and harder review.

## Risks / Trade-offs

- **[Risk] Normalization increases conceptual complexity for a small app** → **Mitigation:** keep the pattern scoped to learning data only and document the entity/view-state split clearly in the slice and selectors.
- **[Risk] Ordering bugs may appear if dashboard lists lose backend order** → **Mitigation:** store ordered id arrays for dashboard and course views instead of reconstructing order from entity maps.
- **[Risk] Mixed old/new selectors during migration can produce inconsistent reads** → **Mitigation:** migrate one view model at a time and remove denormalized fields once all consumers are switched.
- **[Risk] Mutation reducers may miss a relationship edge case** → **Mitigation:** centralize normalization and reconciliation helpers and add reducer/selector tests around create, update, and delete submission flows.
- **[Trade-off] Some selectors become more sophisticated** → **Mitigation:** accept slightly richer selectors in exchange for much simpler reducers and a single source of truth.

## Migration Plan

1. Introduce normalized entity adapters, entity types, and selector helpers alongside the current learning slices.
2. Refactor dashboard/course/assignment/progress fetch reducers to upsert entities and record ordered ids plus request state.
3. Update mutation reducers to reconcile normalized entities directly and remove broad cache invalidation helpers.
4. Switch page selectors and components to normalized view-model selectors.
5. Remove obsolete denormalized state fields and helper functions, then run frontend build/tests and targeted manual verification.

Rollback remains straightforward during development: the change is frontend-only and can be reverted by restoring the previous slice state shape if a migration step causes regressions.

## Open Questions

- Should progress entries become first-class entities, or should the progress page be derived from submissions + assignments + courses without a separate adapter?
- Do we want to add reducer/selector unit tests as part of this change, or rely only on build and manual flow verification?
