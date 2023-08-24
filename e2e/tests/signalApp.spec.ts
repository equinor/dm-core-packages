import { test } from '@playwright/test'

test('signalApp', async ({ page }) => {
  //Starting app
  await page.goto('http://localhost:3000/')
  await page.getByText('apps').click()
  await page.getByText('MySignalApp').click()
  await page.getByText('signalApp', { exact: true }).click()

  //Open Explorer
  await page.getByRole('banner').locator('svg').first().click()
  await page.getByText('Explorer').click()
  await page.getByRole('banner').locator('svg').first().click()
  await page.getByText('View study').click()

  //Open case
  await page.getByRole('button', { name: 'Open' }).click()
  // await page.getByRole('button', { name: 'Expand' }).click()
})
