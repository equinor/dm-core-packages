import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'header' }).click()
  await page.getByRole('button', { name: 'roles_header_example' }).click()
  await page.getByRole('button', { name: 'elonMusk' }).click()
})

test('Admin role', async ({ page }) => {
  await page.getByLabel('AppSelector').nth(1).click()
  await expect(
    page.getByRole('button', { name: 'Yaml', exact: true })
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Explorer' })).toBeVisible()
  await page.getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue(
    'elonMusk'
  )
})

test('Change to operator role and back', async ({ page }) => {
  await test.step('Change role to operator', async () => {
    await page.getByRole('button', { name: 'User' }).click()
    await page.getByLabel('operator').check()
    await page.getByRole('button', { name: 'Save' }).click()
  })

  await test.step('Edit option not visible', async () => {
    await page.getByLabel('AppSelector').nth(1).click()

    await expect(
      page.getByRole('button', { name: 'Yaml', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Explorer' })).toBeVisible()
  })

  await test.step('Edit option not visible through Explorer', async () => {
    await page.getByRole('button', { name: 'Explorer' }).click()
    await page
      .locator('li')
      .filter({ hasText: /^data sourceDemoDataSource$/ })
      .getByRole('button')
      .click()
    await page
      .locator('li')
      .filter({ hasText: /^root packageplugins$/ })
      .getByRole('button')
      .click()
    await page
      .locator('li')
      .filter({ hasText: /^packageheader$/ })
      .getByRole('button')
      .click()
    await page
      .locator('li')
      .filter({ hasText: /^packageroles_header_example$/ })
      .getByRole('button')
      .click()
    await page.getByRole('button', { name: 'file elonMusk' }).nth(1).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByLabel('AppSelector').nth(2).click()
    await expect(
      page.getByRole('button', { name: 'Yaml', exact: true })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Explorer' })).toBeVisible()
    await page.getByRole('button', { name: 'Yaml', exact: true }).click()
  })

  await test.step('Change back to admin', async () => {
    await page.getByLabel('AppSelector').nth(1).click()

    await page
      .getByRole('button', { name: 'Yaml', exact: true })
      .first()
      .click()
    await page.getByRole('button', { name: 'User' }).click()
    await page.getByLabel('admin').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await page.getByLabel('AppSelector').nth(1).click()
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible()
  })
})
