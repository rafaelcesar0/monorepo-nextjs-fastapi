'use client'

import {
	ApiError,
	type HealthResponse,
	healthHealthGet,
	setApiBaseUrl,
	unwrap,
} from '@node-python/api-client'
import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000'
setApiBaseUrl(API_BASE)

type LoadState = 'loading' | 'ready' | 'error'

export default function Home() {
	const [status, setStatus] = useState<LoadState>('loading')
	const [payload, setPayload] = useState<HealthResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()

		setStatus('loading')
		setErrorMessage(null)

		unwrap(healthHealthGet({ signal: controller.signal }))
			.then((data) => {
				setPayload(data)
				setStatus('ready')
			})
			.catch((error) => {
				if (error instanceof DOMException && error.name === 'AbortError') {
					return
				}
				if (error instanceof ApiError) {
					setErrorMessage(`HTTP ${error.status}`)
				} else {
					setErrorMessage(
						error instanceof Error ? error.message : 'Request failed',
					)
				}
				setStatus('error')
			})

		return () => controller.abort()
	}, [])

	return (
		<div className='container mx-auto max-w-3xl px-4 py-10'>
			<div className='grid gap-6'>
				<section className='rounded-lg border p-4'>
					<h2 className='font-medium'>API Status</h2>
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
