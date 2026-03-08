import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$headerExample'
  )
})

test('Load header', async ({ page }) => {
  await expect(page.getByLabel('AppSelector')).toBeVisible()
  await expect(page.getByTestId('application-label')).toBeVisible()
  await expect(page.getByTestId('header-user-info-button')).toBeVisible()
  await expect(page.getByTestId('header-about-button')).toBeVisible()
})

test('User info', async ({ page }) => {
  await page.getByTestId('header-user-info-button').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('dialog').getByText('User info', { exact: true })
  ).toBeVisible()
  await expect(
    page
      .getByRole('dialog')
      .getByText('Name: Not authenticated', { exact: true })
  ).toBeVisible()
})

test('About', async ({ page }) => {
  await page.getByTestId('header-about-button').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page
      .getByRole('dialog')
      .getByText(
        "Application used to test and demo some '@development-framework' plugins",
        { exact: true }
      )
  ).toBeVisible()
  await page
    .getByRole('dialog')
    .getByTestId('about-dialog-close-button')
    .click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('Recipe list', async ({ page }) => {
  await page.getByTestId('application-selector-button').click()
  await expect(page.getByRole('menu')).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue('example')
})
