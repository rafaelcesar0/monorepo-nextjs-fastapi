// Client factory (recommended)

export type { ApiClient, ApiClientConfig, RequestOptions } from './client'
export { ApiError, createApiClient } from './client'
// Low-level (advanced usage)
export { getApiBaseUrl, setApiBaseUrl } from './fetcher'
export * from './generated/client'
// Types
export type { HealthResponse } from './generated/schemas'
// Zod schemas
export * as zodSchemas from './generated/zod'
export { unwrap } from './utils'
