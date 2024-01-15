import { expect, test } from '@playwright/test'

test('Read only primitives', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$readOnlyPrimitives'
  )

  await expect(page.getByLabel('A required string')).not.toBeEditable()

  await expect(
    page.getByLabel('An optional string (Optional)')
  ).not.toBeEditable()

  await expect(page.getByLabel('A required number')).not.toBeEditable()

  await expect(page.getByLabel('Numbers only (Optional)')).not.toBeEditable()

  await expect(page.getByLabel('Integer only (Optional)')).not.toBeEditable()

  await expect(page.getByLabel('An optional checkbox')).not.toBeEditable()

  await expect(
    page.getByLabel('A required checbox (e.g. for confirmation purposes)')
  ).not.toBeEditable()
})
