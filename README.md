# Backend

## Tech Stack
- Node.js + Express
- Prisma _ PostgreSQL
- JWT
- bcrypto
- Zod 
- dotenv

## Features
- Auth: signup/login with JWT
- Protected routes: /stories requires Bearer token
- Validation: Zod schemas for auth + story creation
- DB persistence: Prisma

## Setup
```bash
cd backend
npm install
```
## API Endpoints
Auth
- POST /auth/signup
- POST /auth/login

Stories (requires Authorization header)
- POST /stories
- GET /stories




