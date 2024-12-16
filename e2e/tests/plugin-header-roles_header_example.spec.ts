import { expect, test } from '@playwright/test'

test.use({ permissions: ['clipboard-write'] })

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
  await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Edit' }).click()
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
    await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
  })

  await test.step('Edit option not visible through Explorer', async () => {
    await page.getByRole('menuitem', { name: 'Explorer' }).click()
    const demoDataSourceListItem = page
      .locator('li')
      .filter({ hasText: 'DemoDataSource' })
      .last()
    await demoDataSourceListItem.getByRole('button').click()
    const pluginsListItem = demoDataSourceListItem
      .locator('li')
      .filter({ hasText: 'plugins' })
    await pluginsListItem.getByRole('button').click()
    const headerListItem = pluginsListItem
      .locator('li')
      .filter({ hasText: 'header' })
    await headerListItem.getByRole('button').click()
    await headerListItem
      .locator('li')
      .filter({ hasText: 'roles_header_example' })
      .getByRole('button')
      .click()
    await page.getByRole('button', { name: 'file elonMusk' }).nth(1).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByLabel('AppSelector').nth(1).click()
    await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
    await page.getByRole('menuitem', { name: 'Yaml' }).click()
  })

  await test.step('Change back to admin', async () => {
    await page.getByLabel('AppSelector').nth(1).click()

    await page.getByRole('menuitem', { name: 'Yaml' }).first().click()
    await page.getByRole('button', { name: 'User' }).click()
    await page.getByLabel('admin').check()
    await page.getByRole('button', { name: 'Save' }).click()
    await page.getByLabel('AppSelector').nth(1).click()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible()
  })
})
