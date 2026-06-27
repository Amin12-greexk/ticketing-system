# Internal IT Ticketing System

A production-ready internal IT ticketing system built with Next.js, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js (App Router, standalone output)
- **Language:** TypeScript
- **ORM:** Prisma with `@prisma/adapter-pg`
- **Database:** PostgreSQL 17
- **Styling:** Tailwind CSS + shadcn/ui
- **Containerisation:** Docker multi-stage build

## Prerequisites

| Tool | Minimum version |
| -------------- | --------------- |
| Node.js | 22 |
| npm | 10 |
| Docker | 24 |
| Docker Compose | 2.20 |

## Quick Start (Docker Compose)

```bash
# 1. Clone the repository
git clone <repo-url> && cd ticketing-system

# 2. Create environment file
cp .env.example .env

# 3. Build and start all services
docker compose up -d --build

# 4. (First run only) Seed the database
docker compose exec app node prisma/seed.js
```

The application will be available at **http://localhost:3000**.

## Environment Variables

| Variable | Description | Default |
| ------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma) | `postgresql://postgres:postgres@postgres:5432/ticketing` |
| `POSTGRES_USER` | PostgreSQL user (Compose) | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password (Compose) | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name (Compose) | `ticketing` |
| `APP_PORT` | Host port mapped to the app container | `3000` |
| `NODE_ENV` | Node environment | `production` |

> For production, change `POSTGRES_PASSWORD` to a strong, unique secret.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the dev database
docker compose up postgres -d

# 3. Create a .env file with the local connection string
#    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ticketing

# 4. Generate the Prisma Client
npm run db:generate

# 5. Run migrations
npm run db:migrate:dev

# 6. Seed the database
npm run db:seed

# 7. Start the dev server
npm run dev
```

## Production Deployment

### Docker Compose (VPS / Dokploy)

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop
docker compose down

# Stop and remove database volume (destructive)
docker compose down -v
```

### Dockerfile Only

```bash
# Build the image
docker build -t ticketing-system .

# Run the container (provide DATABASE_URL pointing to your PostgreSQL)
docker run -d \
  --name ticketing-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@db-host:5432/ticketing" \
  ticketing-system
```

## Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Apply migrations to dev database (creates new migration)
npm run db:migrate:dev

# Apply pending migrations to production database
npm run db:migrate

# Seed the database
npm run db:seed

# Reset the database (destructive — drops all data)
npm run db:reset
```

## Deploying on Dokploy via GitHub

1. **Push** the repository to GitHub.
2. In the Dokploy dashboard, create a new **Compose** project.
3. Select **GitHub** as the source and connect your repository.
4. Set the **Compose Path** to `docker-compose.yml`.
5. Add the following environment variables in Dokploy:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD` (use a strong secret)
   - `POSTGRES_DB`
   - `APP_PORT` (optional, defaults to 3000)
6. Configure a **domain** in Dokploy and point it to port `3000`.
7. **Deploy**. Dokploy will build the images and start the services.
8. After the first deploy, seed the database:
   ```bash
   # Via Dokploy terminal or SSH into the server
   docker compose exec app node prisma/seed.js
   ```

### Dokploy — Dockerfile-only deployment

If you prefer deploying only the Next.js container (using an external database):

1. Create a new **Application** (not Compose) in Dokploy.
2. Set the build method to **Dockerfile**.
3. Add `DATABASE_URL` as an environment variable pointing to your external PostgreSQL.
4. Deploy. Migrations run automatically on startup.

## Troubleshooting

| Issue | Solution |
| ------------------------------ | -------------------------------------------------------- |
| App crashes on startup | Check `DATABASE_URL` is correct and PostgreSQL is running |
| Migrations fail | Ensure the database exists and the user has create/alter privileges |
| Port 3000 already in use | Change `APP_PORT` in `.env` or stop the conflicting process |
| Prisma Client not found | Run `npm run db:generate` (or rebuild the Docker image) |
| Seed fails with duplicates | The seed uses `skipDuplicates` — safe to re-run for users/categories |
| Container keeps restarting | Run `docker compose logs app` to see the error |
| Database data lost after restart | Ensure the `postgres_data` volume exists (`docker volume ls`) |
