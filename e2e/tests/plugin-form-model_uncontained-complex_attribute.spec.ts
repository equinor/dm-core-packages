import { expect, test } from '@playwright/test'

test('Model uncontained complex attribute', async ({ page }) => {
  await test.step('Open plugin', async () => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'form' }).click()
    await page.getByRole('button', { name: 'model_uncontained' }).click()
    await page.getByRole('button', { name: 'complex_attribute' }).click()
    await page.getByRole('button', { name: 'TheBlackPearl' }).click()
    await expect(
      page.getByRole('button', { name: 'Copy as YAML' }),
    ).toBeVisible()
  })

  await test.step('Model uncontained', async () => {
    await page.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByLabel('Name')).toHaveValue('TheBlackPearl')
    await page.getByRole('button', { name: 'Open in tab', exact: true }).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).nth(1).click()
    await expect(page.getByTestId('form-text-widget-name').nth(1)).toHaveValue(
      'CaptainJackSparrow',
    )
    await expect(
      page.getByTestId('form-number-widget-Phone Number (optional)'),
    ).toHaveValue('0')
    await page.getByLabel('Close captain').click()
  })

  await test.step('Update model uncontained', async () => {
    await page
      .getByRole('button', { name: 'Edit and save', exact: true })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'DemoDataSource' })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'plugins' })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'form' })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'model_uncontained' })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'complex_attribute' })
      .click()
    await page
      .getByTestId('captain')
      .getByRole('button', { name: 'Barbossa' })
      .click()
    await page.getByRole('button', { name: 'Select', exact: true }).click()
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Open in tab', exact: true }).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).nth(1).click()
    await expect(page.getByTestId('form-text-widget-name').nth(1)).toHaveValue(
      'Barbossa',
    )
    await expect(
      page.getByTestId('form-number-widget-Phone Number (optional)'),
    ).toHaveValue('12345678')
  })
})
