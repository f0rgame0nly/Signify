# SignBridge - Local Setup Guide

## Quick Start (View Pages Only)

If you just want to see the website pages running locally — no database or API keys needed:

1. Install **Node.js** (version 20+) from https://nodejs.org
2. Open the project folder in VS Code
3. Open a terminal (Terminal → New Terminal) and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open **http://localhost:5000** in your browser

That's it! All pages will load and work. The phrase library will use sample data stored in memory. AI features (sign detection, voice, etc.) won't work without an OpenAI API key, but you can browse all pages.

---

## Full Setup (All Features)

Follow these steps to enable all features including AI and database persistence.

### Prerequisites

1. **Node.js** (version 20 or later)
   - Download from: https://nodejs.org
   - Verify installation: `node --version`

2. **PostgreSQL** database (choose one option):
   - **Option A - Local PostgreSQL**: Install from https://www.postgresql.org/download/
   - **Option B - Free cloud database**: Create a free database at https://neon.tech or https://supabase.com

3. **OpenAI API Key**
   - Sign up at https://platform.openai.com
   - Create an API key at https://platform.openai.com/api-keys
   - You will need a paid OpenAI account with credits for the AI features to work

4. **ffmpeg** (required for audio processing)
   - **Windows**: Download from https://ffmpeg.org/download.html and add to PATH
   - **Mac**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`

### Step-by-Step Setup

#### Step 1: Download the Project

Download the project as a zip from Replit (click the three dots menu in the Files panel → "Download as zip"), then unzip it.

Or if you have it on GitHub:
```bash
git clone <your-repo-url>
cd signbridge
```

#### Step 2: Install Dependencies

Open the project folder in VS Code, then open a terminal (Terminal → New Terminal) and run:

```bash
npm install
```

#### Step 3: Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open the `.env` file and fill in your values:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/signbridge
SESSION_SECRET=any-random-string-here
OPENAI_API_KEY=sk-your-openai-api-key
```

**If using a local PostgreSQL database:**
1. Create the database first:
   ```bash
   createdb signbridge
   ```
   Or using psql:
   ```bash
   psql -U postgres -c "CREATE DATABASE signbridge;"
   ```

**If using Neon (cloud database):**
1. Create a project at https://neon.tech
2. Copy the connection string from the dashboard
3. Paste it as your `DATABASE_URL`

#### Step 4: Set Up the Database Tables

Push the database schema to your database:

```bash
npm run db:push
```

#### Step 5: Run the Project

```bash
npm run dev
```

The app will start and you can open it at: **http://localhost:5000**

## Troubleshooting

### "Cannot find module" errors
Run `npm install` again to make sure all dependencies are installed.

### Database connection errors
- Make sure PostgreSQL is running
- Double-check your `DATABASE_URL` in the `.env` file
- If using local PostgreSQL, make sure the database exists (`createdb signbridge`)

### AI features not working
- Verify your `OPENAI_API_KEY` is correct and has credits
- The sign analysis, voice transcription, and text-to-speech features all require a valid OpenAI API key

### Audio conversion errors
- Make sure `ffmpeg` is installed and available in your PATH
- Test with: `ffmpeg -version`

### Port already in use
If port 5000 is busy, set a different port:
```bash
PORT=3000 npm run dev
```

## Project Structure

```
client/src/          → Web frontend (React + TypeScript)
  pages/             → Page components (home, sign-to-text, etc.)
  components/        → Shared UI components
  lib/               → Utilities, translations, API client

server/              → Backend (Express + TypeScript)
  routes.ts          → API endpoints
  storage.ts         → Database operations
  replit_integrations/ → AI service clients (OpenAI)

shared/              → Shared types and schemas
  schema.ts          → Database schema (Drizzle ORM)

mobile/              → React Native / Expo mobile app
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:push` | Push schema changes to database |
| `npm run check` | Run TypeScript type checking |
