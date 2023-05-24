import { test, expect } from '@playwright/test'

test('NestedExample', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$NestedExample').click()
  await page.getByLabel('Baz (optional)').fill('something else')
  await page.getByTestId('form-submit').click()
  await expect(page.getByTestId('form-submit')).toHaveText(['Submit'])
})
