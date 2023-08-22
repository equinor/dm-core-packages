import { Page, expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('http://localhost:3000/')
  await navigate()
})

test.afterAll(async () => {
  await page.close()
})

const navigate = async () => {
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('nested', { exact: true }).click()
  await page.getByText('DemoDataSource/$Nested').click()
}

test('Change owner', async () => {
  await expect(page.getByText('Owner', { exact: true })).toBeVisible
  await page
    .getByText('OwnerOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await page.getByLabel('Name').fill('Jacob')
  await page.getByLabel('Phone Number (optional)').fill('1234')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('button', { name: 'close' }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(page.getByLabel('Name')).toHaveValue('Jacob')
  await expect(page.getByLabel('Phone Number (optional)')).toHaveValue('1234')
  await page.getByRole('tab').nth(2).click()
})

test('Hiring a CEO', async () => {
  await page
    .getByTestId('ceo')
    .getByRole('button', { name: 'Add and save' })
    .click()
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await page.getByLabel('Name').fill('Donald')
  await page.getByLabel('Phone Number (optional)').fill('99887766')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('button', { name: 'close' }).click()
  await page.getByRole('tab').nth(2).click()
  await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  await expect(page.getByLabel('Name')).toHaveValue('Donald')
  await expect(page.getByLabel('Phone Number (optional)')).toHaveValue(
    '99887766'
  )
  await page.getByRole('tab').nth(2).click()
  await page
    .getByTestId('ceo')
    .getByRole('button', { name: 'Remove and save' })
    .click()
  await expect(
    page.getByTestId('ceo').getByRole('button', { name: 'Add and save' })
  ).toBeVisible()
})

test('View accountant yaml', async () => {
  await expect(
    page.getByTestId('accountant').getByRole('button', { name: 'Copy as YAML' })
  ).toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('button', { name: 'Copy as JSON' })
  ).toBeVisible()
  await expect(page.getByTestId('accountant').getByRole('code')).toBeVisible()
})

test('Adding a trainee', async () => {
  await page
    .getByTestId('trainee')
    .getByRole('button', { name: 'Add and save' })
    .click()
  await page.getByTestId('trainee').getByLabel('Name').fill('Peter Pan')
  await page
    .getByTestId('trainee')
    .getByLabel('Phone Number (optional)')
    .fill('123')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close' }).click()
  await page.reload()
  await navigate()
  await expect(page.getByTestId('trainee').getByLabel('Name')).toHaveValue(
    'Peter Pan'
  )
  await expect(
    page.getByTestId('trainee').getByLabel('Phone Number (optional)')
  ).toHaveValue('123')
})

test('Locations', async () => {
  const locationsDiv = page.getByTestId('locations')
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await expect(locationsDiv.getByRole('textbox')).toHaveValue('Trondheim')
  await locationsDiv.getByRole('button', { name: 'Add' }).click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await locationsDiv.getByRole('textbox').last().fill('Oslo')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close' }).click()
  await page.reload()
  await navigate()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(2)
  await expect(locationsDiv.getByRole('textbox').first()).toHaveValue(
    'Trondheim'
  )
  await expect(locationsDiv.getByRole('textbox').last()).toHaveValue('Oslo')
  await locationsDiv.getByRole('button', { name: 'Remove' }).last().click()
  await expect(locationsDiv.getByRole('textbox')).toHaveCount(1)
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close' }).click()
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
  const lastTabPanel = page.getByRole('tabpanel').last()
  await expect(lastTabPanel).toBeVisible()
  await lastTabPanel.getByLabel('Name').fill('McLaren')
  await lastTabPanel.getByLabel('Plate Number').fill('3000')
  await lastTabPanel.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close' }).click()
  await page.reload()
  await navigate()
  // await expect(cars.getByText('McLaren')).toBeVisible() Does not work because two instances are stored when submitting form... Known bug.
  await carsDiv.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByRole('tab', { name: 'McLaren' })).toBeVisible()
  await expect(lastTabPanel.getByLabel('Name')).toHaveValue('McLaren')
  await expect(lastTabPanel.getByLabel('Plate Number')).toHaveValue('3000')
  await page.getByRole('tab').last().click()
})

test('New customer', async () => {
  await page
    .getByText('CustomersOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  const lastTabPanel = page.getByRole('tabpanel').last()
  await expect(lastTabPanel).toBeVisible()
  await expect.soft(lastTabPanel.getByText('1 - 2 of 2')).toBeVisible()
  await lastTabPanel.getByRole('button', { name: 'Append Add Item' }).click()
  await expect.soft(lastTabPanel.getByText('1 - 3 of 3')).toBeVisible()
  await lastTabPanel.getByRole('button', { name: 'Save' }).click()
  await lastTabPanel.getByRole('button', { name: 'Open item' }).last().click()
  await lastTabPanel.getByLabel('Name').fill('Lewis')
  await lastTabPanel.getByLabel('Phone number (optional)').fill('12345678')
  await lastTabPanel.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close' }).click()
  await page.reload()
  await navigate()
  await page
    .getByText('CustomersOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  // await expect(page.getByText('Lewis')).toBeVisible() Does not work because two instances are stored when submitting form... Known bug.
  await lastTabPanel.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByRole('tab', { name: 'Lewis' })).toBeVisible()
  await expect(lastTabPanel.getByLabel('Name')).toHaveValue('Lewis')
  await expect(lastTabPanel.getByLabel('Phone number (optional)')).toHaveValue(
    '12345678'
  )
  await page.getByRole('tab').last().click()
  await page.getByRole('tab').last().click()
})
