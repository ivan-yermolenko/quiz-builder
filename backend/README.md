# Quiz Builder API (Backend)

This is the NestJS backend service for the Quiz Builder web application. It connects to a PostgreSQL database via Prisma ORM and exposes REST endpoints documented with Swagger.

## Features

- **NestJS** application structure with global modules (Prisma, Config)
- **Prisma ORM** with PostgreSQL integration
- **Class-validator / Class-transformer** for input DTO validations with custom constraints
- **Swagger Documentation** automatically generated at runtime
- **Robust Exception Handling** and strict request parameter whitelist checking

## Setup & Running

The backend runs on port **3500** by default.

### Prerequisites

Ensure you have a PostgreSQL database running. You can launch one using the docker-compose file in the project root:
```bash
docker compose up -d
```

### Installation

From this directory (or the workspace root):
```bash
npm install
```

### Database Operations

Configure your database connection in a `.env` file (copy from `.env.example`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:35432/quiz_builder?schema=public"
```

Then run the migrations and seed the initial data:
```bash
# Apply migrations
npx prisma migrate dev

# Seed database with sample quizzes
npx prisma db seed
```

### Run Commands

```bash
# Development mode
npm run start:dev

# Production build & run
npm run build
npm run start:prod

# Unit & E2E Tests
npm run test
npm run test:e2e
```

## API Endpoints

Once running, interactive Swagger API docs are available at:  
👉 **[http://localhost:3500/api/docs](http://localhost:3500/api/docs)**

### Summary of REST Endpoints:

- `GET /api` - Health check status
- `POST /api/quizzes` - Create a new quiz (with questions & options)
- `GET /api/quizzes` - Get all quizzes (returns title & question count)
- `GET /api/quizzes/:id` - Get details of a single quiz by UUID
- `DELETE /api/quizzes/:id` - Delete a quiz by UUID
