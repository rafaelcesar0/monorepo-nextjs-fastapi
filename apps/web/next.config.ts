import type { NextConfig } from 'next'

const apiUrl = process.env.API_URL ?? 'http://localhost:8000'

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ['@node-python/api-client'],
	async rewrites() {
		if (process.env.NODE_ENV !== 'development') {
			return []
		}

		return [
			{
				source: '/api/:path*',
				destination: `${apiUrl}/:path*`,
			},
		]
	},
}

export default nextConfig
