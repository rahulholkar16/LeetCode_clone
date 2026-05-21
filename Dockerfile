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

RUN bunx prisma generate

# Remove unnecessary Prisma engine binaries to reduce image size
RUN find /app/node_modules/@prisma/engines -type f \
    ! -name "*.so.node" \
    ! -name "libquery*" \
    ! -name "schema-engine*" \
    -delete 2>/dev/null || true

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

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + generated client (baked in — no volume mount at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/generated ./prisma/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# App source needed at runtime
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/modules ./modules
COPY --from=builder --chown=nextjs:nodejs /app/types ./types

# Production node_modules, with @prisma overlaid from builder
# (builder has the generated client; prod-deps has everything else)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

# Only the app service runs migrate; worker reuses this image with a CMD override
CMD ["sh", "-c", "bunx prisma migrate deploy && bun server.js"]