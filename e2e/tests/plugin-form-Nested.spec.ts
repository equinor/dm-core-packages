import { expect, Page, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000/')
})

test.beforeEach(async () => {
  await page.reload()
  await navigate()
})

test.afterAll(async () => {
  await page.close()
})

const navigate = async () => {
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'form' }).click()
  await page.getByRole('button', { name: 'nested' }).click()
  await page.getByRole('button', { name: 'DemoDataSource/$Nested' }).click()
}

test('Change owner', async () => {
  await expect(page.getByText('Owner', { exact: true })).toBeVisible
  await page.getByTestId('owner').getByRole('button', { name: 'Open' }).click()
  await page
    .getByRole('tabpanel')
    .getByTestId('form-text-widget-name')
    .fill('Jacob')
  await page
    .getByRole('tabpanel')
    .getByTestId('form-number-widget-Phone Number (optional)')
    .fill('1234')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(
    page.getByRole('tabpanel').getByTestId('form-text-widget-name'),
  ).toHaveValue('Jacob')
  await expect(
    page
      .getByRole('tabpanel')
      .getByTestId('form-number-widget-Phone Number (optional)'),
  ).toHaveValue('1234')
})

test('Hiring a CEO', async () => {
  await page
    .getByTestId('ceo')
    .getByRole('button', { name: 'Add and save' })
    .click()
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await page
    .getByRole('tabpanel')
    .getByTestId('form-text-widget-name')
    .fill('Donald')
  await page
    .getByRole('tabpanel')
    .getByTestId('form-number-widget-Phone Number (optional)')
    .fill('99887766')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.getByLabel('Close ceo').click()
  await expect(page.getByRole('tablist').first()).toHaveCount(1)
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await expect(
    page.getByRole('tabpanel').getByTestId('form-text-widget-name'),
  ).toHaveValue('Donald')
  await expect(
    page
      .getByRole('tabpanel')
      .getByTestId('form-number-widget-Phone Number (optional)'),
  ).toHaveValue('99887766')
  await page.getByLabel('Close ceo').click()
  await page
    .getByTestId('ceo')
    .getByRole('button', { name: 'Remove and save' })
    .click()
  await expect(
    page.getByTestId('ceo').getByRole('button', { name: 'Add and save' }),
  ).toBeVisible()
})

test('View accountant yaml', async () => {
  await expect(
    page
      .getByTestId('accountant')
      .getByRole('button', { name: 'Copy as YAML' }),
  ).toBeVisible()
  await expect(
    page
      .getByTestId('accountant')
      .getByRole('button', { name: 'Copy as JSON' }),
  ).toBeVisible()
  await expect(page.getByTestId('accountant').getByRole('code')).toBeVisible()
})

test('Adding a trainee', async () => {
  const trainee = page.getByTestId('trainee')
  // await trainee.getByLabel('Add and save').click()
  await page.getByTestId('trainee').getByLabel('Add and save').click()
  await trainee.getByTestId('form-text-widget-name').fill('Peter Pan')
  await trainee
    .getByTestId('form-number-widget-Phone Number (optional)')
    .fill('123')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await navigate()
  await expect(trainee.getByTestId('form-text-widget-name')).toHaveValue(
    'Peter Pan',
  )
  await expect(
    trainee.getByTestId('form-number-widget-Phone Number (optional)'),
  ).toHaveValue('123')
})

test('Locations', async () => {
  const locationsDiv = page.getByTestId('locations')
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await expect(locationsDiv.getByRole('textbox')).toHaveValue('Trondheim')
  await locationsDiv.getByRole('button', { name: 'Add' }).click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await locationsDiv.getByRole('textbox').last().fill('Oslo')
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await navigate()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await expect(locationsDiv.getByRole('textbox').first()).toHaveValue(
    'Trondheim',
  )
  await expect(locationsDiv.getByRole('textbox').last()).toHaveValue('Oslo')
  await page.getByTestId('form-text-widget-locations.1').hover()
  await page.getByTestId('form-primitive-array-remove-1').click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await navigate()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
})

test('New car', async () => {
  const carsDiv = page.getByTestId('cars')
  await expect.soft(carsDiv.getByText('1 - 2 of 2')).toBeVisible()
  await carsDiv.getByRole('button', { name: 'Append Add Item' }).click()
  await expect.soft(carsDiv.getByText('1 - 3 of 3')).toBeVisible()
  await carsDiv.getByRole('button', { name: 'Save' }).click()
  await carsDiv.getByRole('button', { name: 'Open item' }).last().click()
  await page
    .getByRole('tabpanel')
    .getByTestId('form-text-widget-name')
    .nth(1)
    .fill('McLaren')
  await page.getByLabel('Plate Number').fill('3000')
  await page.getByTestId('cars').getByTestId('form-submit').click()
  await page.getByText('Document updated').click()
  await page.reload()
  await navigate()
  await expect(carsDiv.getByText('McLaren')).toBeVisible()
  await carsDiv.getByRole('button', { name: 'Open item' }).last().click()
  await expect(
    page.getByRole('tabpanel').getByTestId('form-text-widget-name').nth(1),
  ).toHaveValue('McLaren')
  await expect(page.getByLabel('Plate Number')).toHaveValue('3000')
})

test('New customer', async () => {
  const customersDiv = page.getByTestId('customers')
  await customersDiv.getByRole('button', { name: 'Open' }).click()
  const lastTabPanel = page.getByRole('tabpanel').last()
  await expect(lastTabPanel).toBeVisible()
  await expect.soft(lastTabPanel.getByText('1 - 2 of 2')).toBeVisible()
  await lastTabPanel.getByRole('button', { name: 'Add Item' }).click()
  await expect.soft(lastTabPanel.getByText('1 - 3 of 3')).toBeVisible()
  await lastTabPanel.getByRole('button', { name: 'Save' }).click()
  await lastTabPanel.getByRole('button', { name: 'Open item' }).last().click()
  await lastTabPanel.getByTestId('form-text-widget-name').fill('Lewis')
  await lastTabPanel
    .getByTestId('form-number-widget-Phone Number (optional)')
    .fill('12345678')
  await lastTabPanel.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()
  await page.reload()
  await navigate()
  await customersDiv.getByRole('button', { name: 'Open' }).click()
  await expect(page.getByText('Lewis')).toBeVisible()
  await page
    .getByRole('button', { name: 'Open item', exact: true })
    .last()
    .click()
  await expect(lastTabPanel.getByTestId('form-text-widget-name')).toBeVisible()
  await expect(lastTabPanel.getByTestId('form-text-widget-name')).toHaveValue(
    'Lewis',
  )
  await expect(
    lastTabPanel.getByTestId('form-number-widget-Phone Number (optional)'),
  ).toHaveValue('12345678')
})
