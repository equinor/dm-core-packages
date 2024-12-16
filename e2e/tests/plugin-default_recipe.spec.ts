import { expect, test } from '@playwright/test'

test('Form default DMSS UI Recipe', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$Form'
  )
  await expect(page.getByRole('code')).toBeVisible()
  await page.getByRole('tab', { name: 'Edit' }).click()
  await expect(page.getByLabel('name')).toHaveValue('Form')
  await expect(page.getByLabel('A required string')).toHaveValue(
    'This form has no dedicated UI Recipe'
  )
  await expect(page.getByLabel('An optional checkbox')).toBeVisible()
  await expect(page.getByLabel('date')).toHaveValue('2023-10-17T13:30')
  await expect(page.getByTestId('form-submit')).toBeVisible()
})

test('TableList default DMSS UI Recipe', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$tableList'
  )
  await expect(page.getByRole('code')).toBeVisible()
  await page.getByRole('tab', { name: 'Edit' }).click()
  await page.getByLabel('Open in tab').click()
  await expect(page.getByTestId('expandListItem-0').last()).toBeVisible()
  await page.getByTestId('expandListItem-0').last().click()
  await expect(page.getByRole('button', { name: 'Copy as YAML' })).toBeVisible()
  await page.getByRole('tab', { name: 'Edit' }).last().click()
  await expect(page.getByTestId('form-text-widget-Manufacturer')).toHaveValue(
    'Volvo'
  )
})
