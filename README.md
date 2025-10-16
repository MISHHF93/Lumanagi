# Lumanagi Platform

The Lumanagi interface is a React 18 + Vite application for governing AI infrastructure. The legacy Base44 SDK dependency has been fully removed in favor of an open-source stack built around:

- React 18 with hooks and functional components
- Zustand + Context for global application state
- Tailwind CSS + Radix UI component primitives for theming
- Axios-based API client with TypeScript domain models
- Vite for fast development and build pipelines

## Getting Started

```bash
npm install
npm run dev
```

The UI expects a backend exposed through the `VITE_API_BASE_URL` environment variable. When the API is unreachable, critical data sources fall back to local mock data so the interface remains navigable.

## Useful Commands

```bash
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Lint the project with ESLint
```

## Project Structure Highlights

- `src/lib/apiClient.ts` – Axios instance with error normalization and auth token handling
- `src/lib/entities.ts` – Typed entity interfaces and REST helpers replacing the Base44 entity factory
- `src/api/entities.ts` – Domain-specific entity exports and user session helpers
- `src/api/integrations.ts` – REST integrations for AI orchestration endpoints
- `src/store/useAppStore.ts` – Global Zustand store for user/session/theme state
- `src/pages/` – Feature pages composing the governance experience

## Environment Variables

Create a `.env` file if you need to override defaults:

```
VITE_API_BASE_URL=https://your-api.example.com
```

The application automatically persists auth tokens and user preferences inside `localStorage`.
