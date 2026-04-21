## 1. Define the simplified state structure

- [x] 1.1 Choose the replacement state ownership model for learning data (screen-specific slices or a smaller feature split) and document the target response-shaped state for dashboard, course, assignment, and progress views
- [x] 1.2 Update store wiring and shared type definitions so the new learning state modules coexist cleanly with `user`, `settings`, and `profile`
- [x] 1.3 Identify selectors and page consumers that currently depend on the shared `learningSlice` and map them to the new state ownership model

## 2. Replace the shared learning slice with smaller view-oriented state

- [x] 2.1 Move dashboard fetch state and response handling into its new simplified slice/module and keep the page contract intact
- [x] 2.2 Move course-detail fetch state and response handling into its new simplified slice/module and keep the course page contract intact
- [x] 2.3 Move assignment-detail and progress fetch state and response handling into their new simplified slice/modules and keep their page contracts intact

## 3. Replace reconciliation with post-mutation refetch flows

- [x] 3.1 Refactor submission create/update flows so success triggers the appropriate follow-up backend reads instead of reducer-level reconciliation helpers
- [x] 3.2 Refactor submission delete flow so affected learning views refresh from backend data instead of mutating a shared cache in memory
- [x] 3.3 Refactor profile save flow so dependent profile/dashboard data is refreshed from backend reads after a successful update

## 4. Simplify selectors and remove obsolete state machinery

- [x] 4.1 Rewrite selectors to read from the smaller response-shaped slices/modules rather than a single normalized learning store
- [x] 4.2 Update dashboard, course, assignment, progress, and navigation consumers to use the new selectors while preserving current UX and loading/error behavior
- [x] 4.3 Remove obsolete `learningSlice` reconciliation helpers, relation maps, entity adapters, and any unused shared learning state once all consumers are migrated

## 5. Verify consistency and regression safety

- [x] 5.1 Add or update tests covering post-mutation refetch behavior so dashboard, assignment, progress, and profile views stay consistent without manual reconciliation
- [x] 5.2 Run frontend build and targeted verification of dashboard, course, assignment, progress, and profile flows to confirm the simplified state model works end-to-end
