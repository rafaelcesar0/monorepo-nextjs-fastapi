# API Client

O `@node-python/api-client` é um pacote que contém um **cliente HTTP tipado** gerado automaticamente a partir do OpenAPI do FastAPI usando [Orval](https://orval.dev).

## Para que serve?

- **Type-safety**: Funções de API 100% tipadas
- **Autocompletar**: O editor sugere parâmetros, body e resposta
- **Sincronização**: O cliente sempre reflete o contrato atual da API

## Como funciona?

```
FastAPI (Python)              Orval               Frontend (Next.js)
      |                         |                        |
      v                         v                        v
 /openapi.json  ------>  packages/api-client  ------>  api.health()
```

1. O FastAPI gera automaticamente o schema OpenAPI em `/openapi.json`
2. O Orval lê esse schema e gera funções tipadas em `src/generated/`
3. O frontend cria um cliente com `createApiClient()` e chama os métodos tipados

## Gerando o cliente

Com a API rodando (`bun api:dev`), execute:

```bash
bun api:client
```

Isso atualiza os arquivos em `packages/api-client/src/generated/`.

## Usando no código

### Client factory (recomendado)

```typescript
import { createApiClient, ApiError, type HealthResponse } from "@node-python/api-client";

// Cria instância do cliente com URL base
const api = createApiClient({
  baseUrl: "http://localhost:8000",
  headers: { "X-Custom-Header": "value" }, // opcional
});

// Chamada simples
const data = await api.health();
console.log(data.status); // tipado como HealthResponse

// Com AbortController (para cancelar requisições)
const controller = new AbortController();
const data = await api.health({ signal: controller.signal });

// Tratamento de erro
try {
  const data = await api.health();
} catch (e) {
  if (e instanceof ApiError) {
    console.error(e.status, e.body);
  }
}
```

### Funções low-level (uso avançado)

```typescript
import { healthHealthGet, unwrap } from "@node-python/api-client";

// Chamada direta - retorna { data, status, headers }
const response = await healthHealthGet();
console.log(response.data.status);

// Com unwrap - retorna data diretamente, throw em caso de erro
const data = await unwrap(healthHealthGet());
```

### Tipos gerados

```typescript
import type { HealthResponse } from "@node-python/api-client";

// Tipo de resposta do endpoint /health
const status: HealthResponse = { status: "ok" };
```

## Quando regenerar?

Regenere o cliente sempre que:

- Adicionar novo endpoint na API
- Alterar parâmetros ou resposta de um endpoint
- Adicionar/remover campos em um modelo

```bash
# API precisa estar rodando
bun api:dev

# Em outro terminal
bun api:client
```

## Dicas

1. **Use `createApiClient()`** para criar uma instância configurada do cliente
2. **Passe `signal`** do AbortController para cancelar requisições em cleanup do React
3. **Regenere após mudanças na API** para manter sincronizado
4. **Importe tipos** de `@node-python/api-client` para tipar seus componentes
