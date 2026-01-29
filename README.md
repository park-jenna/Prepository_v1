# Prepository

A full-stack web application for creating, organizing, and managing behavioral interview stories using the STAR framework.

This project is designed as a **production-style CRUD application** with authentication, ownership-based authorization, and a clean separation between frontend, backend, and data layers.

## Features

### Authentication

- JWT-based login
- Protected API routes using Authorization headers
- User ownership enforced on all story operations

### Stories (Full CRUD)

- **Create** new behavioral stories
- **Read** story list and individual story details
- **Update** existing stories via an edit page
- **Delete** stories with confirmation and ownership checks

### UX

- Dashboard listing all user stories
- Story detail page with Edit / Delete actions
- Edit page with prefilled form values
- Client-side validation and error handling

## Tech Stack

### Frontend

- **Next.js (App Router)**
- React
- TypeScript
- Fetch API
- Client Components for forms and interactions

### Backend

- **Node.js**
- **Express**
- JWT authentication
- Prisma ORM

### Database

- PostgreSQL (Supabase)

## Architecture Overview

```text
frontend/
 ├─ app/
 │   ├─ login/
 │   ├─ dashboard/
 │   ├─ stories/
 │   │   ├─ [id]/
 │   │   │   └─ edit/
 ├─ lib/
 │   ├─ api.ts        # low-level fetch wrappers
 │   ├─ auth.ts       # auth-related API logic
 │   └─ stories.ts    # domain-level story APIs

backend/
 ├─ src/
 │   ├─ routes/
 │   │   ├─ auth.js
 │   │   └─ stories.js
 │   ├─ middlewares/
 │   │   └─ auth.js
 │   └─ utils/
 │       └─ jwt.js
 └─ prisma/
```

- **API layer (`api.ts`)**: handles HTTP methods, headers, and error handling
- **Domain layer (`stories.ts`)**: abstracts story-related API calls
- **UI layer**: Next.js App Router pages
- **Backend routes** enforce authentication and user ownership
- **Database access** via Prisma with explicit permission checks

## Authorization & Security

- JWT tokens are issued on login and stored client-side
- All protected routes require a valid token
- Backend verifies:
  - authentication (valid JWT)
  - authorization (story belongs to the logged-in user)
- Update and delete operations are blocked for non-owners

## API Endpoints (Backend)

### Auth

- `POST /auth/signup` – create user (API only, no public signup UI)
- `POST /auth/login` – login and receive JWT

### Stories

- `POST /stories` – create story
- `GET /stories` – list user stories
- `GET /stories/:id` – get story detail
- `PATCH /stories/:id` – update story (partial update)
- `DELETE /stories/:id` – delete story

All `/stories` routes require authentication.

## Why This Project

This project was built to demonstrate:

- Full-stack CRUD workflows
- JWT-based authentication and authorization
- Ownership-based data access control
- Practical Next.js + Express integration
