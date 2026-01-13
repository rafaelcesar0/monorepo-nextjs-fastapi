FROM oven/bun:1.3.5 AS deps

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN bun install --frozen-lockfile

FROM oven/bun:1.3.5 AS build

WORKDIR /app

COPY --from=deps /app/ ./

WORKDIR /app/apps/web

RUN bun run build

FROM oven/bun:1.3.5 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/package.json
COPY --from=build /app/apps/web/next.config.ts ./apps/web/next.config.ts
COPY --from=build /app/packages ./packages

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["bun", "run", "start"]
