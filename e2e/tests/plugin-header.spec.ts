import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$headerExample'
  )
})

test('Load header', async ({ page }) => {
  await expect(page.getByLabel('AppSelector')).toBeVisible()
  await expect(page.getByLabel('main-heading')).toBeVisible()
  await expect(page.getByRole('button', { name: 'User' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'About' })).toBeVisible()
})

test('User info', async ({ page }) => {
  await page.getByRole('button', { name: 'User' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('dialog').getByText('User info', { exact: true })
  ).toBeVisible()
  await expect(
    page
      .getByRole('dialog')
      .getByText('Name:Not authenticated', { exact: true })
  ).toBeVisible()
})

test('About', async ({ page }) => {
  await page.getByRole('button', { name: 'About' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page
      .getByRole('dialog')
      .getByText(
        "Application used to test and demo some '@development-framework' plugins",
        { exact: true }
      )
  ).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Ok' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('Recipe list', async ({ page }) => {
  await page.getByLabel('AppSelector').click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue('example')
})
