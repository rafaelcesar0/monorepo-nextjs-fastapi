let baseUrl = ''

export function setApiBaseUrl(url: string) {
	baseUrl = url.replace(/\/$/, '') // remove trailing slash
}

export function getApiBaseUrl() {
	return baseUrl
}

export async function fetcher<TData>(
	url: string,
	options?: RequestInit,
): Promise<TData> {
	const fullUrl = baseUrl ? `${baseUrl}${url}` : url

	const response = await fetch(fullUrl, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
	})

	const body = [204, 205, 304].includes(response.status)
		? null
		: await response.text()

	const responseData = body ? JSON.parse(body) : {}

	return {
		data: responseData,
		status: response.status,
		headers: response.headers,
	} as TData
}
