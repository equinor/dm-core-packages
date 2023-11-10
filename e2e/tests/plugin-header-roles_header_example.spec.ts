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
  await page.getByRole('button', { name: 'Menu' }).nth(1).click()
  await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  await expect(
    page.getByTestId('name').getByTestId('form-textfield')
  ).toHaveValue('elonMusk')
})

test('Change to operator role and back', async ({ page }) => {
  await test.step('Change role to operator', async () => {
    await page.getByRole('button', { name: 'User' }).click()
    await page.getByLabel('operator').check()
    await page.getByRole('button', { name: 'Cancel' }).click() //We need a save or close button here. "Cancel" is misleading.
  })

  await test.step('Edit option not visible', async () => {
    await page.getByRole('button', { name: 'Menu' }).nth(1).click()
    await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
  })

  await test.step('Edit option not visible through Explorer', async () => {
    await page.getByRole('menuitem', { name: 'Explorer' }).click()
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
    await page.getByRole('button', { name: 'Menu' }).nth(2).click()
    await expect(page.getByRole('menuitem', { name: 'Yaml' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).not.toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Explorer' })).toBeVisible()
  })

  await test.step('Change back to admin', async () => {
    await page.getByRole('button', { name: 'Menu' }).nth(1).click()
    await page.getByRole('menuitem', { name: 'Yaml' }).first().click()
    await page.getByRole('button', { name: 'User' }).click()
    await page.getByLabel('admin').check()
    await page.getByRole('button', { name: 'Cancel' }).click() //We need a save or close button here. "Cancel" is misleading.
    await page.getByRole('button', { name: 'Menu' }).nth(1).click()
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible()
  })
})
