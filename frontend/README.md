# Quiz Builder Client (Frontend)

This is the Next.js frontend application for the Quiz Builder web application, built using React, App Router, and CSS Modules.

## Features

- **Next.js App Router** with Server Components for data fetching and Client Components for interactivity.
- **Form validation** using `react-hook-form` paired with `zod` for type-safe client-side schema validation.
- **Custom Design System** using CSS variables supporting automatic dark mode (`prefers-color-scheme`).
- **Encapsulated components** and SVG icons.
- **SEO Best Practices** with server-side metadata and dynamic page titles.
- **Error Boundaries & Streaming Skeletons** using Next.js `error.tsx`, `not-found.tsx`, and `loading.tsx`.

## Setup & Running

The frontend runs on port **3502** by default.

### Configuration

Create a `frontend/.env.local` file (copy from `.env.example`) to configure the API base URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3501/api
```

### Installation

From this directory:
```bash
npm install
```

### Run Commands

```bash
# Development mode
npm run dev

# Production build & preview
npm run build
npm run start

# Code formatting & validation
npm run lint
```

## Page Routing Structure

- `/quizzes` — Dashboard showing cards for all available quizzes with search, filter, and delete controls.
- `/create` — Form to build a new quiz, dynamically managing questions and options.
- `/quizzes/[id]` — View details of a single quiz.
- `not-found.tsx` — Custom 404 page.
- `error.tsx` — Global React error boundary.
