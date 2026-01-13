import { expect, test } from '@playwright/test'

test('exibe o status da API na home', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByText('API Status')).toBeVisible()
	await expect(page.getByText('"Hello": "World"')).toBeVisible()
})
