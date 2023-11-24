import { expect, test } from '@playwright/test'

test('Media viewer', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'media_viewer' }).click()
  await page.getByRole('button', { name: 'assets' }).click()

  const dialog = page.getByRole('dialog')

  await test.step('video', async () => {
    await page.getByRole('button', { name: 'video' }).click()
    await expect(page.locator('video')).toBeVisible()
    await page.getByRole('button', { name: 'view meta info' }).click()

    await expect(dialog.getByText('video/quicktime')).toBeVisible()
    //await dialog.getByRole('link', { name: 'New tab' }).click() #802 BUG in Chrome (downloads instead of open new tab). Works in Firefox.
    //const newTab = await page1Promise
    //await expect(newTab.getByRole('video')).toBeVisible() //Not sure if "video" is accepted as role
    //await newTab.close()

    const downloadPromise = page.waitForEvent('download')
    await dialog.getByRole('link', { name: 'Download' }).click()
    const download = await downloadPromise
    await download.createReadStream()
  })
  await test.step('gif', async () => {
    await page.getByRole('button', { name: 'fast' }).click()
    await expect(page.getByRole('img', { name: 'fast' })).toBeVisible()
    await page.getByRole('button', { name: 'view meta info' }).click()

    const page1Promise = page.waitForEvent('popup')
    await expect(dialog.getByText('image/gif')).toBeVisible()
    await dialog.getByRole('link', { name: 'New tab' }).click()
    const newTab = await page1Promise
    await expect(newTab.getByRole('img')).toBeVisible()
    await newTab.close()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Download' }).click()
    const download = await downloadPromise
    await download.createReadStream()
  })

  await test.step('image', async () => {
    await page.getByRole('button', { name: 'beauty' }).click()
    await expect(page.getByRole('img', { name: 'beauty' })).toBeVisible()
    await page.getByRole('button', { name: 'view meta info' }).click()

    const page1Promise = page.waitForEvent('popup')
    await expect(dialog.getByText('image/jpeg')).toBeVisible()
    await dialog.getByRole('link', { name: 'New tab' }).click()
    const newTab = await page1Promise
    await expect(newTab.getByRole('img')).toBeVisible()
    await newTab.close()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Download' }).click()
    const download = await downloadPromise
    await download.createReadStream()
  })

  await test.step('pdf', async () => {
    await page.getByRole('button', { name: 'engine_compartment' }).click()
    await expect(page.getByRole('document')).toBeVisible()
  })
})
