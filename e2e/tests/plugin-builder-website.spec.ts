import { expect, test } from '@playwright/test'

// Smoke test for the drag-and-drop website builder plugin. Loads the seeded
// example page, verifies the editor mounts, then switches to Preview and
// verifies the published site renders without the editing chrome.
test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$builderPageExample'
  )
})

test('mounts the builder editor with its toolbar and palette', async ({
  page,
}) => {
  await expect(page.getByText('Website builder')).toBeVisible()
  // The widget palette is only present in edit mode.
  await expect(page.getByText('Widgets')).toBeVisible()
  // The pages sidebar is present with an add-page affordance.
  await expect(page.getByRole('button', { name: 'Add page' })).toBeVisible()
})

test('switches to the read-only preview and hides the editing chrome', async ({
  page,
}) => {
  await expect(page.getByText('Widgets')).toBeVisible()

  await page.getByRole('button', { name: 'Preview', exact: true }).click()

  // Palette and page-editing affordances disappear in preview.
  await expect(page.getByText('Widgets')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Add page' })).toBeHidden()
  // The published navigation menu renders instead.
  await expect(page.getByText('Menu')).toBeVisible()

  // Returning to edit restores the palette.
  await page.getByRole('button', { name: 'Edit', exact: true }).click()
  await expect(page.getByText('Widgets')).toBeVisible()
})
