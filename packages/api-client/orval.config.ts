import dotenv from 'dotenv'
import { defineConfig } from 'orval'

dotenv.config({ path: '../../apps/web/.env' })

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export default defineConfig({
	api: {
		input: {
			target: `${API_URL}/openapi.json`,
		},
		output: {
			target: './src/generated/client.ts',
			schemas: './src/generated/schemas',
			client: 'fetch',
			mode: 'split',
			clean: true,
			override: {
				mutator: {
					path: './src/fetcher.ts',
					name: 'fetcher',
				},
			},
		},
	},
})
