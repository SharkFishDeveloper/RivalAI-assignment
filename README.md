# Task Manager Frontend

Next.js frontend for the Task Manager application.

## Tech Stack

- **Next.js** (App Router) with React 19
- **TypeScript**
- **Tailwind CSS v4**
- **Jest** + Testing Library for unit tests

## Setup

### Prerequisites

- Node.js 18+

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable              | Description        | Default                     |
|----------------------|--------------------|-----------------------------|
| NEXT_PUBLIC_API_URL  | Backend API URL    | http://localhost:8080/api   |

### Run Locally

```bash
npm install
npm run dev
```

### Testing

```bash
npm test
```

## Assumptions & Trade-offs

- JWT tokens are stored in `localStorage` rather than httpOnly cookies for simplicity; this is acceptable for this scope but is vulnerable to XSS
- No external state management library (React Query, SWR, Redux) — data fetching uses plain `useState`/`useEffect`; caching and refetching are manual
- Optimistic updates on task toggle/delete are done client-side with manual rollback on error, trading consistency for perceived performance
- No real-time updates (WebSocket/SSE); users must refresh to see changes made by others
- No server-side rendering for authenticated pages — the dashboard layout awaits client-side auth before rendering content
- Hand-rolled UI components (Button, Input, etc.) instead of a component library; gives full control but requires more maintenance
- No dedicated form validation library — validation is inline and minimal (title required, max length)
- No pagination on the admin users page — full user list is fetched and rendered at once
- Error handling is basic: API errors are thrown as exceptions and displayed via toast notifications; no structured error boundary strategy
- The app assumes tasks without due dates render gracefully and unlimited description/priority length from the API
- Admin users cannot be created through the UI; they must be seeded directly in the database
