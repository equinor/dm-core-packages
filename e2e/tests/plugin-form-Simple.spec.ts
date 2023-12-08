import { expect, test } from '@playwright/test'

test('Simple form', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'form' }).click()
    await page.getByRole('button', { name: 'simple' }).click()
    await page.getByRole('button', { name: 'DemoDataSource/$Simple' }).click()
  }

  await test.step('Open simple form', async () => {
    await page.goto('http://localhost:3000/')
    await navigate()
  })

  await test.step('Remove prefilled optional string', async () => {
    await page.getByLabel('An optional string (Optional)').fill('')
  })

  await test.step('Fill out required string', async () => {
    await page.getByTestId('form-submit').click()
    await expect(page.getByText('Required', { exact: true })).toBeVisible()
    await page.getByLabel('Required string').fill('Foo')
  })

  await test.step('Fill out number field', async () => {
    await page.getByLabel('Numbers only (Optional)').fill('3.14')
  })

  await test.step('Fill out integer field', async () => {
    await page.getByLabel('Integer only (Optional)').fill('123')
  })

  await test.step('Check checkbox', async () => {
    await page.getByLabel('An optional checkbox (Optional)').check()
    //await page.getByTestId('form-submit').click()
    // await expect(page.getByText('<Field is mandatory>')).toBeVisible() //Known bug (itemid:37251754)
    await page
      .getByLabel('A required checkbox (e.g. for confirmation purposes)')
      .check()
  })

  await test.step('Fill out date field', async () => {
    await page.getByLabel('date').fill('01/01/2022')
  })

  await test.step('Submitting form', async () => {
    await page.getByTestId('form-submit').click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  })

  await test.step('Reloading form, expecting entered values to be stored', async () => {
    await page.reload()
    await navigate()
    await expect(page.getByLabel('Optional string (Optional)')).toHaveValue('')
    await expect(page.getByLabel('Required string')).toHaveValue('Foo')
    await expect(page.getByLabel('Numbers only (Optional)')).toHaveValue('3.14')
    await expect(page.getByLabel('Integer only (Optional)')).toHaveValue('123')
    await expect(
      page.getByLabel('An optional checkbox (Optional)')
    ).toBeChecked()
    await expect(
      page.getByLabel('A required checkbox (e.g. for confirmation purposes)')
    ).toBeChecked()
    await expect(page.getByLabel('date')).toHaveValue('01/01/2022')
  })
})
