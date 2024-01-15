import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$signalApp'
  )
})

test('Start SignalApp', async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()
})

test('run Create job', async ({ page }) => {
  await page.getByTestId('cases').getByLabel('Open in tab').click()
  await page.getByRole('button', { name: 'Open in new tab' }).click()
  await page.getByRole('button', { name: 'Run' }).click()
  await page.getByRole('button', { name: 'Show logs' }).click()
  await expect(
    page.getByText('Progress tracking not implemented')
  ).toBeVisible()
})
