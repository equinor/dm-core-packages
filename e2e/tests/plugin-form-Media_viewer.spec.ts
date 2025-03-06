import { expect, test } from '@playwright/test'

test('Media viewer', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'media_viewer' }).click()
  await page.getByRole('button', { name: 'assets' }).click()

  const dialog = page.getByRole('dialog')

  await test.step('video', async () => {
    await page.getByRole('button', { name: 'mediaViewerMOV' }).click()
    await expect(page.locator('video')).toBeVisible()
  })
  await test.step('gif', async () => {
    await page.getByRole('button', { name: 'mediaViewerGIF' }).click()
    await expect(page.locator('img')).toHaveJSProperty('complete', true)
    await expect(page.locator('img')).not.toHaveJSProperty('naturalWidth', 0)
    await expect(page.getByRole('img', { name: 'fast' })).toBeVisible()
  })

  await test.step('image', async () => {
    await page.getByRole('button', { name: 'mediaViewerIMG' }).click()
    await expect(page.locator('img')).toHaveJSProperty('complete', true)
    await expect(page.locator('img')).not.toHaveJSProperty('naturalWidth', 0)
    await expect(page.getByRole('img', { name: 'beauty' })).toBeVisible()
  })

  await test.step('pdf', async () => {
    await page.getByRole('button', { name: 'engine_compartment' }).click()
    await expect(page.getByTestId('embedded-document')).toBeVisible()
  })

  await test.step('bin', async () => {
    await page.getByRole('button', { name: 'random' }).click()
    await expect(page.getByTestId('unknown-file-message')).toBeVisible()
  })
})
