import { test, expect } from '@playwright/test'

test('Simple form', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$Simple').click()

  //Fill out optional string
  await page.getByLabel('Optional string (optional)').fill('Foo')

  //Fill out required string
  await page.getByTestId('form-submit').click()
  await expect(page.getByText('required', { exact: true })).toBeVisible()
  await page.getByLabel('Required string').fill('Bar')

  //Fill out number field
  await page.getByLabel('Numbers only (optional)').fill('Text')
  await expect(page.getByText('Only digits allowed')).toBeVisible()
  await page.getByLabel('Numbers only (optional)').fill('123')

  //Submitting form
  await page.getByTestId('form-submit').click()
  await expect(page.getByTestId('form-submit')).toHaveText(['Submit'])

  // //Reloading form, expecting entered values to be stored
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$Simple').click()
  await expect(page.getByLabel('Optional string (optional)')).toHaveValue('Foo')
  await expect(page.getByLabel('Required string')).toHaveValue('Bar')
  await expect(page.getByLabel('Numbers only (optional)')).toHaveValue('123')
})
