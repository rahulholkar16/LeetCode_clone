# =========================
# STAGE 1 - Base
# =========================
FROM oven/bun:1-alpine AS base
WORKDIR /app

# =========================
# STAGE 2 - Dependencies
# =========================
FROM base AS deps

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# =========================
# STAGE 3 - Builder
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Prisma Client
RUN bunx prisma generate

# Next Build
RUN bun run build

# =========================
# STAGE 4 - Production Dependencies
# =========================
FROM base AS prod-deps

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# =========================
# STAGE 5 - Runner
# =========================
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Production node_modules
COPY --from=prod-deps /app/node_modules ./node_modules

# Prisma generated runtime
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]