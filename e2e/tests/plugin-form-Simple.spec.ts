import { expect, test } from '@playwright/test'

test('Simple form', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'form' }).click()
    await page.getByRole('button', { name: 'simple' }).click()
    await page.getByRole('button', { name: 'DemoDataSource/$Simple' }).click()
  }

  //Open simple form
  await page.goto('http://localhost:3000/')
  await navigate()

  //Remove prefilled optional string
  await page.getByLabel('An optional string (optional)').fill('')

  //Fill out required string
  await page.getByTestId('form-submit').click()
  await expect(page.getByText('Required', { exact: true })).toBeVisible()
  await page.getByLabel('Required string').fill('Foo')

  //Fill out number field
  await page.getByLabel('Numbers only (optional)').fill('Text')
  await expect(page.getByText('Only numbers allowed')).toBeVisible()
  await page.getByLabel('Numbers only (optional)').fill('3.14')

  //Fill out integer field
  await page.getByLabel('Integer only (optional)').fill('3.14')
  await expect(page.getByText('Only integers allowed')).toBeVisible()
  await page.getByLabel('Integer only (optional)').fill('123')

  //Check checkbox
  await page.getByLabel('An optional checkbox (optional)').check()
  //await page.getByTestId('form-submit').click()
  //await expect(page.getByText('<Field is mandatory>')).toBeVisible() //Known bug (itemid:37251754)
  await page
    .getByLabel('A required checbox (e.g. for confirmation purposes)')
    .check()

  //Submitting form
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])

  //Reloading form, expecting entered values to be stored
  await page.reload()
  await navigate()
  await expect(page.getByLabel('Optional string (optional)')).toHaveValue('')
  await expect(page.getByLabel('Required string')).toHaveValue('Foo')
  await expect(page.getByLabel('Numbers only (optional)')).toHaveValue('3.14')
  await expect(page.getByLabel('Integer only (optional)')).toHaveValue('123')
  await expect(page.getByLabel('An optional checkbox (optional)')).toBeChecked()
  await expect(
    page.getByLabel('A required checbox (e.g. for confirmation purposes)')
  ).toBeChecked()
})
