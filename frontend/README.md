# Lumina — Frontend

A modern task management frontend built with React, TypeScript, Vite and TailwindCSS.

Connects to the [TaskFlow API](../taskflow-api).

## Stack

- **React 18** + TypeScript
- **Vite** for bundling
- **TailwindCSS** for styling
- **Zustand** for auth state
- **React Hook Form** for forms
- **Axios** for HTTP
- **React Router DOM v6** for routing

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit VITE_API_URL to point to your backend

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173`

Make sure the backend is running at `http://localhost:3000`.

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Overview with stats and recent activity |
| `/boards` | All boards (create, edit, delete) |
| `/boards/:id` | Board detail with task list and progress |
| `/tasks` | All tasks with filters by board, status and priority |

## Features

- Dark mode only, premium feel (Linear/Vercel inspired)
- JWT auth with persistence via localStorage
- Protected routes
- Skeleton loaders
- Toast notifications
- Modals with keyboard support (Escape to close)
- Empty states
- Responsive sidebar layout
- Priority badges (High / Medium / Low)
- Task completion toggle
- Progress bar per board

## Design

Color palette inspired by modern SaaS tools:
- Background: `#0a0a0f` (deep dark)
- Surface: `#0f0f17`
- Accent: `#7c6af7` (violet)
- Typography: DM Sans (body) + JetBrains Mono (code/dates)
