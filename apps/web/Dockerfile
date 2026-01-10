FROM oven/bun:1.3.5

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN bun install --frozen-lockfile

WORKDIR /app/apps/web
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
