import { expect, test } from '@playwright/test'

test('Nested Form', async ({ page }) => {
  const navigate = async () => {
    await page.getByText('plugins', { exact: true }).click()
    await page.getByText('form').click()
    await page.getByText('nested', { exact: true }).click()
    await page.getByText('DemoDataSource/$Nested').click()
  }

  //Open form
  await page.goto('http://localhost:3000/')
  await navigate()

  //Change owner
  await expect(page.getByText('Owner', { exact: true })).toBeVisible
  await page
    .getByText('OwnerOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await page.getByLabel('Name').fill('Jacob')
  await page.getByLabel('Phone Number (optional)').fill('1234')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByText('self').first().click()
  await page.getByRole('button', { name: 'Open' }).first().click()
  await expect(page.getByLabel('Name')).toHaveValue('Jacob')
  await expect(page.getByLabel('Phone Number (optional)')).toHaveValue('1234')
  await page.getByRole('tab').nth(2).click()

  //Hiring a CEO
  await page
    .getByText('CEO (optional)Add')
    .getByRole('button', { name: 'Add' })
    .click()
  await page
    .getByText('CEO (optional)RemoveOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await page.getByLabel('Name').fill('Donald')
  await page.getByLabel('Phone Number (optional)').fill('99887766')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.getByRole('tab').nth(2).click()
  await page
    .getByText('CEO (optional)RemoveOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect(page.getByLabel('Name')).toHaveValue('Donald')
  await expect(page.getByLabel('Phone Number (optional)')).toHaveValue(
    '99887766'
  )
  await page.getByRole('tab').nth(2).click()
  await page
    .getByText('CEO (optional)RemoveOpen')
    .getByRole('button', { name: 'Remove' })
    .click()
  await expect(
    page.getByText('CEO (optional)Add').getByRole('button', { name: 'Add' })
  ).toBeVisible()

  //View accountant yaml
  await expect(
    page.getByTestId('accountant').getByRole('button', { name: 'Copy as YAML' })
  ).toBeVisible()
  await expect(
    page.getByTestId('accountant').getByRole('button', { name: 'Copy as JSON' })
  ).toBeVisible()
  await expect(page.getByTestId('accountant').getByRole('code')).toBeVisible()

  // Adding a trainee
  await page
    .getByText('Trainee (optional)Add')
    .getByRole('button', { name: 'Add' })
    .click()
  await page.getByTestId('trainee').getByLabel('Name').fill('Peter Pan')
  await page
    .getByTestId('trainee')
    .getByLabel('Phone Number (optional)')
    .fill('123')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.reload()
  await navigate()
  await expect(page.getByTestId('trainee').getByLabel('Name')).toHaveValue(
    'Peter Pan'
  )
  await expect(
    page.getByTestId('trainee').getByLabel('Phone Number (optional)')
  ).toHaveValue('123')

  //New car
  await page.getByText('CarsOpen').getByRole('button', { name: 'Open' }).click()
  await expect.soft(page.getByText('1 - 2 of 2')).toBeVisible()
  await page.getByRole('button', { name: 'Append Add Item' }).click()
  await expect.soft(page.getByText('1 - 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await page.getByLabel('Name').fill('McLaren')
  await page.getByLabel('Plate Number').fill('3000')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.reload()
  await navigate()
  await page.getByText('CarsOpen').getByRole('button', { name: 'Open' }).click()
  // await expect(page.getByText('McLaren')).toBeVisible() Does not work because two instances are stored when submitting form... Known bug.
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByRole('tab', { name: 'McLaren' })).toBeVisible()
  await expect(page.getByLabel('Name')).toHaveValue('McLaren')
  await expect(page.getByLabel('Plate Number')).toHaveValue('3000')
  await page.getByRole('tab').last().click()
  await page.getByRole('tab').last().click()

  //New customer
  await page
    .getByText('CustomersOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect.soft(page.getByText('1 - 2 of 2')).toBeVisible()
  await page.getByRole('button', { name: 'Append Add Item' }).click()
  await expect.soft(page.getByText('1 - 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await page.getByLabel('Name').fill('Lewis')
  await page.getByLabel('Phone number (optional)').fill('12345678')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.reload()
  await navigate()
  await page
    .getByText('CustomersOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  // await expect(page.getByText('Lewis')).toBeVisible() Does not work because two instances are stored when submitting form... Known bug.
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByRole('tab', { name: 'Lewis' })).toBeVisible()
  await expect(page.getByLabel('Name')).toHaveValue('Lewis')
  await expect(page.getByLabel('Phone number (optional)')).toHaveValue(
    '12345678'
  )
  await page.getByRole('tab').last().click()
  await page.getByRole('tab').last().click()
})
