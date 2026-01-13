'use client'

import type { paths } from '@node-python/api-client'
import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api'

type HealthResponse =
	paths['/health']['get']['responses']['200']['content']['application/json']

type LoadState = 'loading' | 'ready' | 'error'

export default function Home() {
	const [status, setStatus] = useState<LoadState>('loading')
	const [payload, setPayload] = useState<HealthResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()

		setStatus('loading')
		setErrorMessage(null)

		fetch(`${API_BASE}/health`, { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`)
				}
				return (await response.json()) as HealthResponse
			})
			.then((data) => {
				setPayload(data)
				setStatus('ready')
			})
			.catch((error) => {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return
				}
				setErrorMessage(
					error instanceof Error ? error.message : 'Request failed',
				)
				setStatus('error')
			})

		return () => controller.abort()
	}, [])

	return (
		<div className='container mx-auto max-w-3xl px-4 py-10'>
			<div className='grid gap-6'>
				<section className='rounded-lg border p-4'>
					<div className='flex flex-wrap items-center justify-between gap-2'>
						<h2 className='font-medium'>API Status</h2>
						<span className='text-muted-foreground text-xs'>
							Base: {API_BASE}
						</span>
					</div>
					<pre className='mt-3 rounded-md bg-muted px-3 py-2 text-xs'>
						{status === 'loading' && 'Connecting...'}
						{status === 'error' && `Failed: ${errorMessage ?? 'Unknown error'}`}
						{status === 'ready' && JSON.stringify(payload, null, 2)}
					</pre>
				</section>
			</div>
		</div>
	)
}
