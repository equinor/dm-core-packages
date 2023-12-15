import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'view_selector' }).click()
  await page.getByRole('button', { name: 'roles_school_example' }).click()
  await page.getByRole('button', { name: 'HogwartsMeta' }).click()
})

test('Admin role', async ({ page }) => {
  await expect(
    page.getByRole('tab', { name: 'Hogwarts Admin', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Hogwarts All', exact: true })
  ).toBeVisible()
  await expect(page.getByTestId('form-text-widget-Name')).toBeEditable()
  await page.getByRole('tab', { name: 'Hogwarts All', exact: true }).click()
  await expect(page.getByRole('tabpanel').locator('#name')).not.toBeEditable()
})

test('Change role to operator and back', async ({ page }) => {
  await expect(
    page.getByRole('tab', { name: 'Hogwarts Admin', exact: true })
  ).toBeVisible()
  await page.getByRole('button', { name: 'User' }).click()
  await page.getByLabel('operator').check()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(
    page.getByRole('tab', { name: 'Hogwarts All', exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Hogwarts Admin', exact: true })
  ).not.toBeVisible()
  await expect(page.getByTestId('form-text-widget-Name')).not.toBeEditable()
  await page.getByRole('button', { name: 'User' }).click()
  await page.getByLabel('admin').check()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByRole('tab', { name: 'Hogwarts Admin', exact: true }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toBeEditable()
})
