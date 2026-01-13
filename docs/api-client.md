# API Client

O `@node-python/api-client` é um pacote que contém os **tipos TypeScript** gerados automaticamente a partir do OpenAPI do FastAPI.

## Para que serve?

- **Type-safety**: Garante que o frontend use os tipos corretos da API
- **Autocompletar**: O editor sugere os campos disponíveis nas respostas
- **Sincronização**: Os tipos sempre refletem o contrato atual da API

## Como funciona?

```
FastAPI (Python)          openapi-typescript          Frontend (Next.js)
      |                          |                          |
      v                          v                          v
 /openapi.json  ------>  packages/api-client  ------>  import { paths }
```

1. O FastAPI gera automaticamente o schema OpenAPI em `/openapi.json`
2. O `openapi-typescript` lê esse schema e gera `types.ts`
3. O frontend importa os tipos e usa nas chamadas de API

## Gerando os tipos

Com a API rodando (`bun api:dev`), execute:

```bash
bun api:client
```

Isso atualiza o arquivo `packages/api-client/src/types.ts`.

## Usando no código

### Importando tipos

```typescript
import type { paths, operations } from "@node-python/api-client";
```

### Exemplo: Tipo de resposta

```typescript
// Tipo da resposta do endpoint GET /health
type HealthResponse = paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

// Uso
const [data, setData] = useState<HealthResponse | null>(null);
```

### Exemplo: Fetch com tipo

```typescript
import type { paths } from "@node-python/api-client";

type HealthResponse = paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health");
  return response.json();
}
```

### Exemplo: Parâmetros de rota

Se a API tiver um endpoint como `GET /users/{id}`:

```typescript
// Parâmetros da rota
type UserParams = paths["/users/{id}"]["get"]["parameters"]["path"];
// { id: number }

// Resposta
type UserResponse = paths["/users/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
```

### Exemplo: Body de POST

Se a API tiver um endpoint `POST /users`:

```typescript
// Body do request
type CreateUserBody = paths["/users"]["post"]["requestBody"]["content"]["application/json"];

// Resposta
type CreateUserResponse = paths["/users"]["post"]["responses"]["201"]["content"]["application/json"];

async function createUser(data: CreateUserBody): Promise<CreateUserResponse> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## Estrutura dos tipos

O arquivo `types.ts` exporta:

| Export | Descrição |
|--------|-----------|
| `paths` | Todos os endpoints da API |
| `operations` | Operações por `operationId` |
| `components` | Schemas reutilizáveis (modelos) |

### Navegando em `paths`

```typescript
paths["/endpoint"]["method"]["responses"]["statusCode"]["content"]["mediaType"]
```

Exemplo:
```typescript
paths["/health"]["get"]["responses"]["200"]["content"]["application/json"]
//     ^endpoint  ^GET   ^responses   ^200   ^content   ^JSON
```

## Quando regenerar?

Regenere os tipos sempre que:

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

1. **Sempre use `type` em vez de `interface`** para tipos importados
2. **Crie aliases** para tipos longos que você usa frequentemente
3. **Regenere após mudanças na API** para manter sincronizado
