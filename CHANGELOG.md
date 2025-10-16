# Changelog

## [v1.0.0] – 2025-10-16

### Features
- Introduced an Axios API client with auth-aware interceptors and a health check helper to standardize backend communication and error handling across the app.
- Added a resilient entity service layer that syncs typed governance datasets between local storage and live endpoints, supporting offline-first reads and CRUD fallbacks.
- Published comprehensive TypeScript definitions for governance entities to align domain models across modules and UI surfaces.
- Delivered lightweight Zustand-compatible stores for authentication and UI preferences, providing persisted tokens, theme toggles, and sidebar state management.
- Bootstrapped a Node-based React Testing Library harness with automated discovery to keep smoke tests runnable in minimal environments.

### Fixes
- Updated the Security Posture dashboard to rely on enriched alert and incident models, guard optional fields, and compute metrics from normalized data.
- Hardened navigation utilities so generated sidebar links trim whitespace yet preserve PascalCase routes, keeping router resolution accurate.

### Refactors
- Centralized route generation to iterate over the dashboard module registry, simplifying additions and ensuring consistent active-page detection throughout the layout.
- Replaced legacy context scaffolding with a typed AuthProvider that sources state from the shared store, handles refresh flows, and exposes logout semantics for the UI.

### Cleanup
- Documented the migration in README and MIGRATION_REPORT while publishing environment defaults for new deployments.
- Removed obsolete vendor-specific modules and scripts in favor of the consolidated entity catalog and Axios integration to reduce surface area.
