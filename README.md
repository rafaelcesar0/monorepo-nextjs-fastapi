# node-python monorepo

Monorepo com Next.js (App Router) e FastAPI, usando Bun workspaces + Turborepo para dev e Docker para producao.

## Estrutura

```
repo/
  apps/
    web/                 # Next.js
    api/                 # FastAPI
  packages/
    api-client/          # tipos gerados do OpenAPI
    config/              # configs compartilhados
  package.json
  turbo.json
  docker-compose.prod.yml
```

## Requisitos

- Bun
- Python 3.12+
- uv (para o backend)

## Desenvolvimento

1) Instale deps:

```bash
bun install
```

2) Suba tudo (web + api):

```bash
bun dev
```

- Web: http://localhost:3000
- API: http://localhost:8000

### Apenas web

```bash
bun web:dev
```

### Apenas api

```bash
bun api:dev
```

O comando da API executa `uv sync` e inicia o Uvicorn com reload.

### Gerar client OpenAPI

Com a API rodando:

```bash
bun api:client
```

Isso atualiza `packages/api-client/src/types.ts` a partir de `http://localhost:8000/openapi.json`.

[Saiba mais](docs/api-client.md)

## Atualizar deps do backend (uv)

Edite `apps/api/pyproject.toml` e rode:

```bash
cd apps/api
uv lock --upgrade
uv sync
```

Isso atualiza o `uv.lock` e instala as dependencias.

## Produção (Docker + Dokploy)

Build local (opcional):

```bash
docker compose -f docker-compose.prod.yml build
```

Os containers expõem apenas as portas internas:
- web: 3000
- api: 8000

Nao ha proxy no repositorio. O roteamento e HTTPS sao configurados no painel do Dokploy.

### Opcoes de roteamento no Dokploy

Opcao 1 — Mesmo dominio com path:
- WEB: Host=app.seudominio.com Path=/ Internal Path=/ Strip Path=OFF Container Port=3000
- API: Host=app.seudominio.com Path=/api Internal Path=/ Strip Path=ON  Container Port=8000

Opcao 2 — Subdominio:
- WEB: Host=app.seudominio.com Path=/ Internal Path=/ Strip Path=OFF Container Port=3000
- API: Host=api.seudominio.com Path=/ Internal Path=/ Strip Path=OFF Container Port=8000

## Variaveis de ambiente

Cada app precisa de seu proprio `.env`. Consulte os `.env.example` de cada app:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```
