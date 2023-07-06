import { expect, test } from '@playwright/test'

test('Nested Form', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('nested', { exact: true }).click()
  await page.getByText('DemoDataSource/$Nested').click()

  //A nested object
  await expect(page.getByText('Owner', { exact: true })).toBeVisible
  await page.getByRole('button', { name: 'Open' }).first().click()
  await page.getByLabel('Name').fill('Jacob')
  await page.getByLabel('Phone Number (optional)').fill('1234')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(page.getByLabel('Name')).toHaveValue('Jacob')
  await expect(page.getByLabel('Phone Number (optional)')).toHaveValue('1234')
})
