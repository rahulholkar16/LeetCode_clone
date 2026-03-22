# STAGE 1 - Base
FROM oven/bun:1 AS base
WORKDIR /app

# STAGE 2 - Dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# STAGE 3 - Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN bunx prisma generate
RUN bun run build
RUN ls .next/standalone && ls .next/static

# STAGE 4 - Runner
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public

# Standalone output
COPY --from=builder /app/.next/standalone ./

# Static files ANDAR standalone ke
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]