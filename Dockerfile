# ── Stage 1: Install all dependencies ─────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (output: src/generated/prisma)
RUN npx prisma generate

# Build Next.js in standalone mode
# Provide a dummy DATABASE_URL so Prisma client initialisation doesn't throw
# during Next.js page-data collection. No actual DB connection is made at build.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# ── Stage 3: Production dependencies only ─────────────────────────────────────
FROM node:22-alpine AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# ── Stage 4: Production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server (includes its own bundled node_modules)
COPY --from=builder /app/.next/standalone ./
# Copy static assets and public files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy production node_modules for prisma CLI, migrations, and seed script
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy the generated Prisma client
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

# Copy Prisma files needed for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copy the startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
