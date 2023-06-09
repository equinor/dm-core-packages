import { test, expect } from '@playwright/test'

test('NestedExample plugin', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$NestedExample').click()

  //Empty current input and enter new
  await page.getByLabel('Foo (optional)').clear()
  await page.getByLabel('Foo (optional)').fill('1234')
  await page.getByLabel('Bar').clear()
  await page.getByLabel('Bar').fill('Bar')
  await page.getByLabel('Baz (optional)').clear()
  await page.getByLabel('Baz (optional)').fill('Something else')
  await page.getByTestId('form-submit').click()
  await expect(page.getByTestId('form-submit')).toHaveText(['Submit'])

  //Reloading form, expecting entered values to be stored
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$NestedExample').click()
  await expect(page.getByLabel('Foo (optional)')).toHaveValue('1234')
  await expect(page.getByLabel('Bar')).toHaveValue('Bar')
  await expect(page.getByLabel('Baz (optional)')).toHaveValue('Something else')
})
