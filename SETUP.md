# Setup Guide for Computer Store Management System

This guide provides detailed instructions for setting up the Computer Store Management System application.

## Prerequisites

1. **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/) (v14 or newer)
2. **PostgreSQL**: Download and install from [postgresql.org](https://www.postgresql.org/) (v12 or newer)
3. **Git**: Download and install from [git-scm.com](https://git-scm.com/)

## Database Setup

1. Install PostgreSQL and set it up:
   - During installation, set a password for the 'postgres' user
   - Remember this password for the next steps

2. Create a new database:
   - Open pgAdmin or use the PostgreSQL command line
   - Create a new database named `toko_komputer_db`

   ```sql
   CREATE DATABASE toko_komputer_db;
   ```

## Application Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd central-computers
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_NAME=toko_komputer_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   SESSION_SECRET=your_random_secret_string
   ```

   Replace `your_postgres_password` with the password you set for PostgreSQL.
   Generate a random string for `SESSION_SECRET` (you can use any random string generator).

3. Install backend dependencies:
   ```
   npm install
   ```

4. Install frontend dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

## Running the Application

1. Run both frontend and backend concurrently:
   ```
   npm run dev:full
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Troubleshooting

### Database Connection Issues

If you see an error like "password authentication failed for user 'postgres'":

1. Check that your PostgreSQL server is running
2. Verify that the password in your `.env` file matches your PostgreSQL password
3. Make sure the database `toko_komputer_db` exists

### Missing Files in client/public

If you see an error about missing files in the client/public directory:

1. Ensure the following files exist in the client/public directory:
   - index.html
   - manifest.json
   - robots.txt

### Other Issues

For other issues, check:
1. Node.js and npm versions (run `node -v` and `npm -v`)
2. PostgreSQL is running (check services on Windows or use `pg_isready` on Linux/Mac)
3. All required ports are available (3000 for React, 5000 for Express) 