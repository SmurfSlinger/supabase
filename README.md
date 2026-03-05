### This is a simple Next.js application that uses Supabase for authentication and database storage/management, and is a full-stack setup complete with:
- Next.js app router
- Supabase authentication
- PostgreSQL database
- Row Level Security
- Database migrations
- Github actions for migration deployment

# Features:
- User signup/login
- Authentication protected dashboard
- User profile page
- Profiles table linked to Supabase auth users
- Automatic profile creation via database trigger
- Row level security so users can access only their own data

# Tech stack:
- Next.js
- Supabase
- PostgreSQL
- TypeScript
- Github actions

# To Run the Project Locally:

1: Install Dependencies
- npm install

2: Start Supabase locally
- supabase start

3: Run dev server
- npm run dev

4: Open in browser
- http://localhost:3000

- (or custom port)

# Database Migrations:
Database schema changes are stored in:
- supabase/migrations

To apply migrations locally:
- supabase db reset

or

- supabase db push

# Github Actions Migration Workflow:

This repository includes a GitHub Action that automatically applies migrations to the production Supabase database.

- .github/workflows/migrate.yml

Required Github secrets:

- SUPABASE_ACCESS_TOKEN
- SUPABASE_PROJECT_REF
- SUPABASE_DB_PASSWORD

# Structure:
```
app/
  login/
  signup/
  dashboard/
  profile/

lib/
  supabaseClient.ts

supabase/
  migrations/
```