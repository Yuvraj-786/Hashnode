# Inkwell – React frontend

Light-themed React + Vite frontend for the MERN Hashnode-style blog. It uses the existing backend exactly as implemented (Bearer JWT, no cookies).

## Run

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm run dev
```

The backend must allow CORS from `http://localhost:5173`.

## Structure

- `src/api/` – `apiClient.js` (axios, base URL, automatic Bearer token) + one file per resource
- `src/context/AuthContext.jsx` – `user`, `token`, `authStatus` (`loading | authenticated | guest`)
- `src/routes/ProtectedRoute.jsx` – shows `LoadingState`, redirects guests to `/login`
- `src/pages/` – one file per route
- `src/components/` – reusable UI (`Layout`, `Navbar`, `Footer`, `ErrorBoundary`, `ConfirmDialog`, …)
- `src/utils/` – date, error-message, URL validation, and small helpers
- Design tokens (colors, radii, fonts) live at the top of `src/index.css`

## Backend-supported

Auth, feed, search (`?search=`), post detail (slug), tags, archive (frontend grouping of `GET /api/posts`), dashboard, editor (`/editor/:id` finds the post in `GET /api/posts/mine`), public profiles (by id), and profile settings.

