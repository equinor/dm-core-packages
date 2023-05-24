import { test, expect } from '@playwright/test'

test('signalApp', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('apps').click()
  await page.getByText('MySignalApp').click()
  await page.getByText('signalApp', { exact: true }).click()
  await page.getByRole('banner').locator('svg').first().click()
  await page.getByText('Explorer').click()

  await page.getByRole('banner').locator('svg').first().click()
  await page.getByText('SideBar').click()
  await page.getByRole('button', { name: 'Open' }).click()
})
