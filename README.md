# Quiz Builder

A full-stack application to create, list, and view quizzes with various question types (Boolean, Input, Checkbox).

## Project Structure

- `backend/` - NestJS API server
- `frontend/` - Next.js client application
- `docker-compose.yml` - PostgreSQL service container config
- `package.json` - Root scripts to orchestrate backend and frontend

---

## Quick Start

You can install dependencies, initialize the database schema, and launch both application servers with just two commands. The project works out-of-the-box using fallback defaults for local Docker development.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Docker** and **Docker Compose**
- **npm** (comes with Node.js)

---

### Step 1: Install Dependencies

From the root directory of the project, run:

```bash
npm install
```

This installs root dependencies (like `concurrently` for running tasks in parallel) and automatically triggers the installations inside both the `backend/` and `frontend/` directories.

---

### Step 2: Start Everything

To spin up the PostgreSQL Docker database, run database migrations, and start both backend and frontend development servers concurrently:

```bash
npm run start:all
```

Once started:
- **Web Application Dashboard**: **http://localhost:3502**
- **Interactive Swagger Documentation**: **http://localhost:3501/api/docs**

---

## Optional: Custom Configuration (.env)

By default, the application is pre-configured to connect to the Docker database on port **35432** and run the servers on ports **3501** (backend) and **3502** (frontend). 

If you want to customize these values (e.g. for staging or production deployment), you can optionally create environment files:

1. **Backend**:
   Create a `backend/.env` file (see `backend/.env.example`):
   ```env
   PORT=3501
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db_name>?schema=public"
   FRONTEND_URL="http://localhost:3502"
   ```
2. **Frontend**:
   Create a `frontend/.env.local` file (see `frontend/.env.example`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3501/api
   ```

---

## Usage

### Creating a Quiz

1. Open **http://localhost:3502** in your browser.
2. Click **Create Quiz** in the top navigation bar.
3. Enter a quiz title (e.g. *JavaScript Trivia*).
4. Add your questions:
   - **True / False (Boolean)**: Select the correct option.
   - **Short Text Answer (Input)**: Define the correct textual answer (e.g. *const*).
   - **Multiple Choice (Checkbox)**: Add several options and check all correct ones.
5. Submit the form. You will be redirected to the list of all quizzes.
6. Click on a quiz to preview its structure or click the delete button (on card hover) to remove it.
