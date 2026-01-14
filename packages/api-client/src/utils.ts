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

type OrvalResponse<T> = { data: T; status: number; headers: Headers }

/**
 * Unwrap orval response - returns data directly, throws ApiError on non-2xx
 */
export async function unwrap<T>(
	promise: Promise<OrvalResponse<T>>,
): Promise<T> {
	const { data, status } = await promise
	if (status >= 400) {
		throw new ApiError(data, status)
	}
	return data
}
