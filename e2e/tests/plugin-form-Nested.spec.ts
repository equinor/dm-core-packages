import { type Page, expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$Nested'
  )
})

test.beforeEach(async () => {
  await page.reload()
})

test.afterAll(async () => {
  await page.close()
})

test('Change owner', async () => {
  await expect(page.getByText('Owner', { exact: true })).toBeVisible
  await page.getByTestId('owner').getByRole('button', { name: 'Open' }).click()
  await page
    .getByRole('tabpanel')
    .getByTestId('form-text-widget-Name')
    .fill('Jacob')
  await page
    .getByRole('tabpanel')
    .getByTestId('form-number-widget-Phone Number (Optional)')
    .fill('1234')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(
    page.getByRole('tabpanel').getByTestId('form-text-widget-Name')
  ).toHaveValue('Jacob')
  await expect(
    page
      .getByRole('tabpanel')
      .getByTestId('form-number-widget-Phone Number (Optional)')
  ).toHaveValue('1234')
})

test('Hiring a CEO', async () => {
  await page.getByTestId('ceo').getByLabel('Create new entity').click()
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await page
    .getByRole('tabpanel')
    .getByTestId('form-text-widget-Name')
    .fill('Donald')
  await page
    .getByRole('tabpanel')
    .getByTestId('form-number-widget-Phone Number (Optional)')
    .fill('99887766')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.getByLabel('Close ceo').click()
  await expect(page.getByRole('tablist').first()).toHaveCount(1)
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await expect(
    page.getByRole('tabpanel').getByTestId('form-text-widget-Name')
  ).toHaveValue('Donald')
  await expect(
    page
      .getByRole('tabpanel')
      .getByTestId('form-number-widget-Phone Number (Optional)')
  ).toHaveValue('99887766')
  await page.getByLabel('Close ceo').click()
  await page
    .getByTestId('ceo')
    .getByRole('button', { name: 'Delete permanently' })
    .click()
  await page.getByLabel('Confirm Delete').click()
  await expect(
    page.getByTestId('ceo').getByLabel('Create new entity')
  ).toBeVisible()
})

test('View accountant yaml', async () => {
  await expect(
    page.getByTestId('accountant').getByRole('button', { name: 'Copy as YAML' })
  ).toBeVisible()
  await expect(page.getByTestId('accountant').getByRole('code')).toBeVisible()
})

test('Adding a trainee', async () => {
  await page.getByTestId('trainee').getByText('Create').click()
  await page.reload()
  await expect(page.getByTestId('form-text-widget-Name').last()).toBeVisible()
  await page.getByTestId('form-text-widget-Name').last().fill('Peter Pan')
  await page
    .getByTestId('form-number-widget-Phone Number (Optional)')
    .last()
    .fill('123')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await expect(page.getByTestId('form-text-widget-Name').last()).toHaveValue(
    'Peter Pan'
  )
  await expect(
    page.getByTestId('form-number-widget-Phone Number (Optional)').last()
  ).toHaveValue('123')
})

test('Locations', async () => {
  const locationsDiv = page.getByTestId('locations')
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await expect(locationsDiv.getByRole('textbox')).toHaveValue('Trondheim')
  await locationsDiv.getByLabel('Add new item to list').click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await locationsDiv.getByRole('textbox').last().fill('Oslo')
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await expect(locationsDiv.getByRole('textbox').first()).toHaveValue(
    'Trondheim'
  )
  await expect(locationsDiv.getByRole('textbox').last()).toHaveValue('Oslo')
  await page.getByTestId('form-text-widget-locations.1').hover()
  await page.getByTestId('form-primitive-array-remove-1').click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
})

test('New car', async () => {
  const carsDiv = page.getByTestId('cars')
  await carsDiv.getByLabel('Add to list').click()
  await carsDiv.getByRole('button', { name: 'Save' }).click()
  await carsDiv.getByRole('button', { name: 'Expand item' }).last().click()
  await carsDiv.getByTestId('form-text-widget-Name').fill('McLaren')
  await carsDiv.getByTestId('form-text-widget-Plate Number').fill('3000')
  await carsDiv.getByTestId('form-submit').click()
  await page.getByText('Document updated').click()
  await page.reload()
  await expect(carsDiv.getByText('McLaren')).toBeVisible()
  await carsDiv.getByRole('button', { name: 'Expand item' }).last().click()
  await expect(carsDiv.getByTestId('form-text-widget-Name')).toHaveValue(
    'McLaren'
  )
  await expect(
    carsDiv.getByTestId('form-text-widget-Plate Number')
  ).toHaveValue('3000')
})

test('New customer', async () => {
  const customersDiv = page.getByTestId('customers')
  await customersDiv.getByRole('button', { name: 'Open' }).click()
  const lastTabPanel = page.getByRole('tabpanel').last()
  await expect(lastTabPanel).toBeVisible()
  await lastTabPanel.getByLabel('Add to list').click()
  await lastTabPanel.getByRole('button', { name: 'Save' }).click()
  await lastTabPanel.getByRole('button', { name: 'Expand item' }).last().click()
  await lastTabPanel.getByTestId('form-text-widget-Name').fill('Lewis')
  await lastTabPanel
    .getByTestId('form-number-widget-Phone Number (Optional)')
    .fill('12345678')
  await lastTabPanel.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await customersDiv.getByRole('button', { name: 'Open' }).click()
  await expect(page.getByText('Lewis').last()).toBeVisible()
  await page
    .getByRole('button', { name: 'Expand item', exact: true })
    .last()
    .click()
  await expect(lastTabPanel.getByTestId('form-text-widget-Name')).toBeVisible()
  await expect(lastTabPanel.getByTestId('form-text-widget-Name')).toHaveValue(
    'Lewis'
  )
  await expect(
    lastTabPanel.getByTestId('form-number-widget-Phone Number (Optional)')
  ).toHaveValue('12345678')
})
