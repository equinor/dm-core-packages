import { expect, test } from '@playwright/test'

test('Read only primitives', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('read_only_primitives').click()
  await page.getByText('ReadOnlyPrimitives').click()

  await expect(page.getByLabel('A required string')).not.toBeEditable()

  await expect(
    page.getByLabel('An optional string (optional)')
  ).not.toBeEditable()

  await expect(page.getByLabel('A required number')).not.toBeEditable()

  await expect(page.getByLabel('Numbers only (optional)')).not.toBeEditable()

  await expect(page.getByLabel('Integer only (optional)')).not.toBeEditable()

  await expect(
    page.getByLabel('An optional checkbox (optional)')
  ).not.toBeEditable()

  await expect(
    page.getByLabel('A required checbox (e.g. for confirmation purposes)')
  ).not.toBeEditable()
})
