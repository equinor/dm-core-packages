import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'header' }).click()
  await page.getByRole('button', { name: 'package example_app' }).click()
  await page.getByRole('button', { name: 'file example' }).click()
})

test('Load header', async ({ page }) => {
  await expect(page.getByLabel('AppSelector').nth(1)).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Data Modelling Example App' })
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'User' }).nth(1)).toBeVisible()
  await expect(page.getByRole('button', { name: 'About' }).nth(1)).toBeVisible()
})

test('User info', async ({ page }) => {
  await page.getByRole('button', { name: 'User' }).nth(1).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('dialog').getByText('User info', { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole('dialog').getByText('Name:', { exact: true })
  ).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('About', async ({ page }) => {
  await page.getByRole('button', { name: 'About' }).nth(1).click()
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
  await page.getByLabel('AppSelector').nth(1).click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue('example')
})
