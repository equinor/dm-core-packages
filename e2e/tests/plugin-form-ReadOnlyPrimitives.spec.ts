import { expect, test } from '@playwright/test'

test('Read only primitives', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'form' }).click()
  await page.getByRole('button', { name: 'read_only_primitives' }).click()
  await page.getByRole('button', { name: 'ReadOnlyPrimitives' }).click()

  await expect(page.getByLabel('readonly-A required string')).toBeVisible()

  await expect(
    page.getByLabel('readonly-An optional string (Optional)')
  ).toBeVisible()

  await expect(page.getByLabel('readonly-A required number')).toBeVisible()

  await expect(
    page.getByLabel('readonly-Numbers only (Optional)')
  ).toBeVisible()

  await expect(
    page.getByLabel('readonly-Integer only (Optional)')
  ).toBeVisible()

  await expect(
    page.getByLabel('An optional checkbox (Optional)')
  ).not.toBeEditable()

  await expect(
    page.getByLabel('A required checbox (e.g. for confirmation purposes)')
  ).not.toBeEditable()
})
