# node-python

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the web application.

## Project Structure

```
node-python/
├── apps/
│   ├── web/         # Frontend application (Next.js)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Biome formatting and linting
- `bun run test:e2e`: Run end-to-end tests with Playwright

## End-to-end tests

First, install Playwright browsers (one-time setup):

```bash
bunx playwright install --with-deps
```

Then, run the tests:

```bash
bun run test:e2e
```

## Docker (web + api)

Build and run both services:

```bash
docker compose up --build
```

Web will be available at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:8000](http://localhost:8000).
