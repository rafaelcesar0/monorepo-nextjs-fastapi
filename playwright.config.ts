import { defineConfig } from '@playwright/test'

const webUrl = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:8000'

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	expect: {
		timeout: 10_000,
	},
	use: {
		baseURL: webUrl,
		trace: 'on-first-retry',
	},
	webServer: [
		{
			command: 'bun run api:dev',
			url: apiUrl,
			reuseExistingServer: !process.env.CI,
			env: {
				CORS_ORIGINS: webUrl,
			},
			timeout: 120_000,
		},
		{
			command: 'bun run web:dev',
			url: webUrl,
			reuseExistingServer: !process.env.CI,
			env: {
				API_URL: apiUrl,
				NEXT_PUBLIC_API_BASE: '/api',
			},
			timeout: 120_000,
		},
	],
})
