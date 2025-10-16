# Changelog

## v1.0.0

### Features
- Introduced an Axios API client with auth-aware interceptors and a health check helper to standardize backend communication and error handling across the app.【F:src/api/client.ts†L1-L53】
- Added a resilient entity service layer that syncs typed governance datasets between local storage and live endpoints, supporting offline-first reads and CRUD fallbacks.【F:src/api/entities.ts†L1-L199】
- Published comprehensive TypeScript definitions for governance entities to align domain models across modules and UI surfaces.【F:src/lib/entities.ts†L1-L160】
- Delivered lightweight Zustand-compatible stores for authentication and UI preferences, providing persisted tokens, theme toggles, and sidebar state management.【F:src/store/authStore.ts†L1-L77】【F:src/store/uiStore.ts†L1-L58】
- Bootstrapped a Node-based React Testing Library harness with automated discovery to keep smoke tests runnable in minimal environments.【F:test/run-tests.mjs†L1-L94】【F:test/esbuild-loader.mjs†L1-L83】【F:test/rtl-shim.tsx†L1-L120】

### Fixes
- Updated the Security Posture dashboard to rely on enriched alert and incident models, guard optional fields, and compute metrics from normalized data.【F:src/pages/SecurityPosture.jsx†L1-L198】
- Hardened navigation utilities so generated sidebar links trim whitespace yet preserve PascalCase routes, keeping router resolution accurate.【F:src/utils/index.ts†L1-L8】【F:src/pages/Layout.jsx†L1-L185】

### Refactors
- Centralized route generation to iterate over the dashboard module registry, simplifying additions and ensuring consistent active-page detection throughout the layout.【F:src/pages/index.jsx†L1-L143】
- Replaced legacy context scaffolding with a typed AuthProvider that sources state from the shared store, handles refresh flows, and exposes logout semantics for the UI.【F:src/contexts/AuthProvider.tsx†L1-L67】【F:src/App.jsx†L1-L15】

### Cleanup
- Documented the migration in README and MIGRATION_REPORT while publishing environment defaults for new deployments.【F:README.md†L1-L64】【F:MIGRATION_REPORT.md†L1-L16】【F:.env.example†L1-L5】
- Removed obsolete Base44-specific modules and scripts in favor of the consolidated entity catalog and Axios integration to reduce surface area.【F:src/api/client.ts†L1-L53】【F:src/api/entities.ts†L1-L199】

