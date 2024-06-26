import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page, browser }) => {
  browser.newContext({
    viewport: { width: 1920, height: 1800 },
  })
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'data source DemoDataSource' }).click()
  await page.getByRole('button', { name: 'root package plugins' }).click()
})

test('Create folder', async ({ page }) => {
  await page
    .getByRole('button', { name: 'root package plugins', exact: true })
    .click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'New folder' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Name').fill('Playwright')
  await dialog.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Folder is created'])
  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'package Playwright' })
  ).toBeVisible()
})

test('Create blueprint', async ({ page }) => {
  await page
    .getByRole('button', { name: 'package Playwright', exact: true })
    .click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'New blueprint' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Name').fill('PlaywrightBlueprint')
  await dialog.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Blueprint is created'])
  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'blueprint PlaywrightBlueprint' })
  ).toBeVisible()
})

test('Create entity with name', async ({ page }) => {
  await page
    .getByRole('button', { name: 'package Playwright', exact: true })
    .click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'New entity' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByPlaceholder('Select').click()
  await dialog.getByRole('button', { name: 'DemoDataSource' }).click()
  await dialog.getByRole('button', { name: 'plugins' }).click()
  await dialog.getByRole('button', { name: 'Playwright' }).click()
  await dialog.getByRole('button', { name: 'PlaywrightBlueprint' }).click()
  await dialog.getByLabel('Name').fill('PlaywrightEntity')
  await dialog.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Entity is created'])
  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'file PlaywrightEntity' })
  ).toBeVisible()
})

test('Delete folder with content', async ({ page }) => {
  await page.getByRole('button', { name: 'package Playwright' }).click({
    button: 'right',
  })
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Deleted'])
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'package Playwright' })
  ).not.toBeVisible()
})

test('Create entity with required name', async ({ page }) => {
  await page.getByRole('button', { name: 'form' }).click()
  await page.getByRole('button', { name: 'uncontained_object' }).click({
    button: 'right',
  })
  await page.getByRole('menuitem', { name: 'New entity' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled()
  await dialog.getByPlaceholder('Select').click()
  await dialog.getByRole('button', { name: 'DemoDataSource' }).click()
  await dialog.getByRole('button', { name: 'plugins' }).click()
  await dialog.getByRole('button', { name: 'form' }).click()
  await dialog.getByRole('button', { name: 'uncontained_object' }).click()
  await dialog.getByRole('button', { name: 'blueprints' }).click()
  await dialog.getByRole('button', { name: 'person' }).click()
  await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled()
  await dialog.getByLabel('Name').fill('Jessica')
  await expect(dialog.getByRole('button', { name: 'Create' })).toBeEnabled()
  await dialog.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Entity is created'])
  await page.getByRole('button', { name: 'Jessica' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue('Jessica')
  await page.getByRole('button', { name: 'Jessica' }).click({
    button: 'right',
  })
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await dialog.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('button', { name: 'Jessica' })).not.toBeVisible()
})
