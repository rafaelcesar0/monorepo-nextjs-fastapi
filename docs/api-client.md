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
 /openapi.json  ------>  packages/api-client  ------>  healthHealthGet()
```

1. O FastAPI gera automaticamente o schema OpenAPI em `/openapi.json`
2. O Orval lê esse schema e gera funções tipadas em `src/generated/`
3. O frontend importa e usa as funções diretamente

## Gerando o cliente

Com a API rodando (`bun api:dev`), execute:

```bash
bun api:client
```

Isso atualiza os arquivos em `packages/api-client/src/generated/`.

## Usando no código

### Funções geradas (100% type-safe)

```typescript
import { healthHealthGet, unwrap, ApiError } from "@node-python/api-client";

// Chamada direta - retorna { data, status, headers }
const response = await healthHealthGet();
console.log(response.data.status);

// Com unwrap - retorna data diretamente, throw em caso de erro
const data = await unwrap(healthHealthGet());
console.log(data.status); // tipado!

// Tratamento de erro
try {
  const data = await unwrap(healthHealthGet());
} catch (e) {
  if (e instanceof ApiError) {
    console.error(e.status, e.body);
  }
}
```

### Tipos gerados

```typescript
import type { HealthHealthGet200 } from "@node-python/api-client";

// Tipo de resposta do endpoint /health
const status: HealthHealthGet200 = { status: "ok" };
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

1. **Use `unwrap()`** para obter data tipado diretamente
2. **Regenere após mudanças na API** para manter sincronizado
3. **Importe tipos** de `@node-python/api-client` para tipar seus componentes
