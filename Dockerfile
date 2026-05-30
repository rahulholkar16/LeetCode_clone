# STAGE 1 - Base
FROM oven/bun:1-alpine AS base
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

# Remove config so prisma generate falls back to schema only, no binary download
RUN rm -f prisma.config.ts

RUN bunx prisma generate --schema ./prisma/schema.prisma

RUN bun run build

# STAGE 4 - Production deps only
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# STAGE 5 - Runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Next.js build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma schema + generated client (baked in — no volume mount at runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated ./prisma/generated
COPY prisma.config.ts ./prisma.config.ts

# App source needed at runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/modules ./modules
COPY --from=builder /app/types ./types

# Production node_modules, with @prisma overlaid from builder
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# Only the app service runs migrate; worker reuses this image with a CMD override
CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]