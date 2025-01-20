import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

const ADD_ROW_LABEL = 'Add data row'
const CLEAR_TABLE_LABEL = 'Clear table content'
const DEFAULT_EXAMPLE_PAGE =
  'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$Default'
const DEFAULT_EXAMPLE_CONTENT_AREA = 'enabled:dmss://DemoDataSource/$Default'
const NUMERIC_EXAMPLE_PAGE =
  'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$Numeric'
const NUMERIC_EXAMPLE_CONTENT_AREA = 'enabled:dmss://DemoDataSource/$Numeric'

test('Unknown dimensions', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeVisible()
  await expect(table.getByRole('textbox').first()).toHaveValue('Dodge')
  await table.getByRole('textbox').first().fill('Not Dodge')
  await expect(table.getByRole('textbox').first()).toHaveValue('Not Dodge')
})

test('Set dimensions', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page
    .getByRole('button', { name: 'Set dimensions', exact: true })
    .click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeHidden()
  await expect(table.getByRole('textbox').nth(16)).toHaveValue('Ford')
})

test('Vertical (Set dimensions)', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page
    .getByRole('button', { name: 'Vertical (Set dimensions)', exact: true })
    .click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeHidden()
  await expect(table.getByRole('textbox').nth(4)).toHaveValue('Ford')
  await expect(table.getByRole('textbox').nth(15)).toHaveValue(
    '1D3MX48D48B28FPJU'
  )
})

test('Vertical (Unknown dimensions)', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page
    .getByRole('button', { name: 'Vertical (Unknown dimensions)', exact: true })
    .click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeVisible()
  await expect(table.getByRole('textbox').nth(4)).toHaveValue('Ford')
  await expect(table.getByRole('textbox').nth(10)).toHaveValue(
    'Extended Cab Pickup'
  )
})

test('Custom labels', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page.getByRole('button', { name: 'Custom labels', exact: true }).click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeHidden()
  await expect(table.getByText('John')).toBeVisible()
  await expect(table.getByText('Manufacturer')).toBeVisible()
})

test('Hidden labels', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page.getByRole('button', { name: 'Hidden labels', exact: true }).click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')

  await expect(table.getByText('A', { exact: true })).toBeHidden()
  await expect(table.getByText('2', { exact: true })).toBeHidden()
})

test('No-edit columns and rows', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page
    .getByRole('button', { name: 'No-edit columns and rows', exact: true })
    .click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeHidden()
})

test('Non-editable', async ({ page }) => {
  await page.goto(DEFAULT_EXAMPLE_PAGE)
  await page.getByRole('button', { name: 'Non-editable', exact: true }).click()
  const contentArea = page.getByTestId(DEFAULT_EXAMPLE_CONTENT_AREA)
  const table = contentArea.getByRole('table')
  await expect(contentArea.getByLabel(ADD_ROW_LABEL)).toBeHidden()
  await expect(contentArea.getByLabel(CLEAR_TABLE_LABEL)).toBeHidden()
  await expect(table.getByRole('textbox').first()).toHaveValue('Dodge')
  await expect(table.getByRole('textbox').first()).toHaveAttribute('readonly')
})

test('Integer is number input in data grid', async ({ page }) => {
  await page.goto(NUMERIC_EXAMPLE_PAGE)
  const contentArea = page.getByTestId(NUMERIC_EXAMPLE_CONTENT_AREA)
  await expect(contentArea).toBeVisible()
  const table = contentArea.getByRole('table')
  await expect(table).toBeVisible()
  await expect(table.locator('input').first()).toHaveValue('1000')
  await expect(table.locator('input').first()).toHaveAttribute('type', 'number')
})
