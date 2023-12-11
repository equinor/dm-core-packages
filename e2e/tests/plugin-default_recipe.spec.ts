import { expect, test } from '@playwright/test'

test('Form default DMSS UI Recipe', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'default_recipe' }).click()
  await page.getByRole('button', { name: 'file Form' }).click()
  await page.getByRole('tab', { name: 'Edit' }).click()

  await expect(page.getByLabel('name')).toHaveValue('Form')
  await expect(page.getByLabel('A required string')).toHaveValue(
    'This form has no dedicated UI Recipe'
  )
  await expect(page.getByLabel('An optional checkbox (Optional)')).toBeVisible()
  await expect(page.getByLabel('date')).toHaveValue('2023-10-17T13:30')
  await expect(page.getByTestId('form-submit')).toBeEnabled()
})

test('TableList default DMSS UI Recipe', async ({ page }) => {
  await test.step('Open plugin', async () => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'default_recipe' }).click()
    await page.getByRole('button', { name: 'TableList' }).click()
    await page.getByRole('tab', { name: 'Edit' }).click()
  })

  await test.step('Open item in tab', async () => {
    await page
      .getByRole('group', { name: 'Cars' })
      .getByLabel('Open in tab')
      .click()
    await page
      .getByRole('row', { name: 'Volvo' })
      .getByRole('button', { name: 'Expand item', exact: true })
      .click()
    await expect(
      page.getByRole('button', { name: 'Copy as YAML' })
    ).toBeVisible()
    await page.getByRole('tab', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-text-widget-name').nth(1)).toHaveValue(
      'Volvo'
    )
  })
})
