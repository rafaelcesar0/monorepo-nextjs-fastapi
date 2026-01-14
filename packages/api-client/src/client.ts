import type { HealthResponse } from './generated/schemas'

export class ApiError extends Error {
	status: number
	body: unknown
	constructor(body: unknown, status: number) {
		super(typeof body === 'string' ? body : JSON.stringify(body))
		this.name = 'ApiError'
		this.status = status
		this.body = body
	}
}

export interface ApiClientConfig {
	baseUrl: string
	headers?: Record<string, string>
}

export interface RequestOptions {
	signal?: AbortSignal
	headers?: Record<string, string>
}

async function request<T>(
	config: ApiClientConfig,
	path: string,
	options?: RequestOptions & RequestInit,
): Promise<T> {
	const url = `${config.baseUrl.replace(/\/$/, '')}${path}`

	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...config.headers,
			...options?.headers,
		},
	})

	const body = [204, 205, 304].includes(response.status)
		? null
		: await response.text()

	const data = body ? JSON.parse(body) : null

	if (!response.ok) {
		throw new ApiError(data, response.status)
	}

	return data as T
}

export function createApiClient(config: ApiClientConfig) {
	return {
		health: (options?: RequestOptions) =>
			request<HealthResponse>(config, '/health', { ...options, method: 'GET' }),
	}
}

export type ApiClient = ReturnType<typeof createApiClient>
