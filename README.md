# Hashnode

A full-stack blogging platform inspired by Hashnode. Readers can discover and search articles, browse tags, and view author profiles. Registered users can write and manage posts and update their profile.

## Features

- Register, log in, and access protected pages with token-based authentication
- Browse, search, and read published posts
- Create, edit, and delete posts from the dashboard
- Browse tags and view public author profiles
- Update profile details, including name, bio, and avatar
- Responsive React interface with reusable components

Some interface pages are not connected to backend functionality yet, including bookmarks, password reset, email verification, series, contact submissions, and account deletion.

## Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt

## Screenshots

Screenshots are not in the repository yet. Add captures to `docs/screenshots/` and replace these placeholders:

| Page | Screenshot |
| --- | --- |
| Home feed | `docs/screenshots/home-feed.png` |

| Post detail | `docs/screenshots/post-detail.png` |
| User profile | `docs/screenshots/user-profile.png` |

Once added, display them here with Markdown, for example:

```md
![Home feed](docs/screenshots/home-feed.png)
```

## Run locally

You will need Node.js, npm, and a running MongoDB instance. Start the backend and frontend in separate terminals from the repository root.

### 1. Configure and start the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` if needed. Set `MONGODB_URL` to your MongoDB connection string and replace `JWT_SECRET` with a private random value. Then start the API:

```powershell
node server.js
```

The API runs at `http://localhost:3000` by default.

### 2. Configure and start the frontend

In a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend API URL is configured in `frontend/.env`.

For macOS or Linux, use `cp .env.example .env` in place of `Copy-Item`.

## Tests and build

Run the backend tests:

```powershell
cd backend
npm test
```

Build the frontend for production:

```powershell
cd frontend
npm run build
```

## Project structure

```text
backend/
  src/       API routes, controllers, models, middleware, and database setup
  test/      Backend API contract tests
frontend/
  src/
    api/     API clients
    components/ Reusable interface components
    context/ Authentication state
    pages/   Application pages
```
