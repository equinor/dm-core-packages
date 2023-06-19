import { test, expect } from '@playwright/test'

test('Form Example plugin', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('example', { exact: true }).click()
  await page.getByText('DemoDataSource/$formExample').click()

  //A bool
  await page.getByTestId('form-checkbox').uncheck()
  await page.getByTestId('form-submit').click()
  await expect(page.getByTestId('form-checkbox')).not.toBeChecked()

  //Add a list of string
  await page.getByTestId('add-listOfStrings').click()
  await page.locator('input[id="listOfStrings.2"]').fill('test')
  await page.keyboard.press('Enter')
  await page.getByText('A list of strings')
  await expect(page.locator('input[id="listOfStrings.2"]')).toBeVisible()
  await expect(page.locator('input[id="listOfStrings.2"]')).toHaveValue('test')
  await page.getByRole('button', { name: 'Remove' }).nth(2).click()
  await expect(page.locator('input[id="listOfStrings.2"]')).not.toBeVisible()

  //A nested object
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(page.getByText('A nested object', { exact: true })).toBeVisible
  await page.getByLabel('Foo (optional)').fill('1234')
  await page.getByLabel('Bar').fill('bar test')
  await page.getByLabel('Baz (optional)').fill('baz test')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(page.getByLabel('Foo (optional)')).toHaveValue('1234')
  await expect(page.getByLabel('Bar')).toHaveValue('bar test')
  await expect(page.getByLabel('Baz (optional)')).toHaveValue('baz test')
})
