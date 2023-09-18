import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('apps').click()
  await page.getByText('MySignalApp').click()
  await page.getByText('signalApp', { exact: true }).click()
})

test('Start SignalApp', async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()
})

test('run Create job', async ({ page }) => {
  await page.getByRole('button', { name: 'Open' }).click()
  await page.getByRole('button', { name: 'Open' }).click()
  await page.getByRole('button', { name: 'Create new job' }).click()

  await expect(page.getByText('The job has not been started')).toBeVisible()
  await page.getByRole('button', { name: 'Start' }).click()
  await expect(page.getByText('Progress tracking not implemented')).toBeVisible()

  // await page.getByRole('button', { name: 'Get results' }).click()
  // await expect(page.getByText('12345')).toBeVisible()

  await page.getByRole('button', { name: 'Close case1' }).click()
  await page.getByRole('button', { name: 'Open' }).click()
  await expect(page.locator('.nsewdrag')).toHaveScreenshot({
    maxDiffPixelRatio: 0.25,
  })
})
