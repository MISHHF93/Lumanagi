# Lumanagi Platform

Lumanagi is an AI governance and security intelligence control plane built with Vite + React. The application has been refactored away from legacy Base44 dependencies and now ships with an offline-friendly data layer, authenticated state powered by a Zustand-style store, and a typed entity catalogue for all governance domains.

## Running the app

```bash
npm install
```

Create a `.env` file by copying `.env.example` and adjusting values for your environment.

Start the development server:

```bash
npm run dev
```

## Building the app

```bash
npm run build
```

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the Vite development server. |
| `npm run start` | Alias for `vite --host` to run the dev server on all interfaces. |
| `npm run lint` | Run ESLint across the project. |
| `npm run test` | Execute the Node.js test runner with JSX support through the esbuild loader. |
| `npm run build` | Generate a production build. |
| `npm run preview` | Preview the production build. |
| `npm run full` | Run linting, tests, and build in sequence. |

## Architecture Notes

- **API Client** – `src/api/client.ts` wraps Axios with auth interceptors and resilient error handling.
- **Domain Entities** – `src/lib/entities.ts` defines typed domain models with seeded offline data used by `src/api/entities.ts`.
- **State Management** – `src/store/authStore.ts` and `src/store/uiStore.ts` provide global auth and UI state via a lightweight Zustand-compatible implementation. `src/contexts/AuthProvider.tsx` exposes auth state through React context.
- **Testing** – Initial tests live under `src/pages/__tests__/` and rely on the offline-friendly shim in `test/rtl-shim.tsx` that emulates React Testing Library queries inside the Node runner.
- **Command Center** – The command modal is rendered at the layout level and uses audit logging for all privileged actions.

## Environment Variables

See `.env.example` for the required variables. At a minimum you should set `VITE_API_BASE_URL` to point to your backend API.

## Migration Status

- Base44 SDK, assets, and configuration have been removed.
- Axios with interceptors is used for all API calls.
- Entities are typed and seeded for offline UX.
- Zustand-style stores manage authentication and global UI state.
- Radix UI components remain themed for light/dark responsiveness.
- A starter test suite ensures key governance modules render correctly.
