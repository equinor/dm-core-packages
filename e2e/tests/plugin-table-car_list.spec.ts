import { expect, test } from '@playwright/test'

test('Table car list example', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'table' }).click()
    await page.getByRole('button', { name: 'car_list' }).click()
    await page.getByRole('button', { name: 'CarList' }).click()
  }

  //Open form
  await page.goto('http://localhost:3000/')
  await navigate()

  //Add a new car by using expand (not "open")
  await page.getByRole('button', { name: 'Add row' }).click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.getByRole('button', { name: 'Open expandable row' }).last().click()
  await page.getByLabel('Manufacturer').fill('Audi')
  await page.getByLabel('Model').fill('e-tron')
  await page.getByLabel('Color (optional)').fill('Black')
  await page.getByTestId('form-submit').click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()

  //Currently we need to reload application to view saved values...
  await page.reload()
  await navigate()
  await expect(page.getByText('1 - 2 of 2')).toBeVisible()
  await expect(page.getByText('Audi')).toBeVisible()
  await expect(page.getByText('e-tron')).toBeVisible()
  await expect(page.getByText('Black')).toBeVisible()

  //Open table item and edit
  await page.getByRole('button', { name: 'Open', exact: true }).last().click()
  await page.getByLabel('Manufacturer').fill('Polestar')
  await page.getByLabel('Model').fill('2023')
  await page.getByLabel('Color (optional)').fill('Grey')
  await page.getByTestId('form-submit').click()
  await page.getByLabel('Close Audi').click()
  await expect(page.getByText('name')).toBeVisible()

  //Currently we need to reload application to view saved values...
  await page.reload()
  await navigate()
  await expect(page.getByText('1 - 2 of 2')).toBeVisible()
  await expect(page.getByText('Polestar')).toBeVisible()
  await expect(page.getByText('2023')).toBeVisible()
  await expect(page.getByText('Grey')).toBeVisible()

  //Move table item up
  await expect(page.locator('tr').nth(1)).toContainText('Volvo')
  await expect(page.locator('tr').nth(2)).toContainText('Polestar')
  await page.getByRole('button', { name: 'Move row up' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.reload()
  await navigate()
  await expect(page.locator('tr').nth(1)).toContainText('Polestar')
  await expect(page.locator('tr').nth(2)).toContainText('Volvo')

  //Move table item down
  await page.getByRole('button', { name: 'Move row down' }).first().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.reload()
  await navigate()
  await expect(page.locator('tr').nth(1)).toContainText('Volvo')
  await expect(page.locator('tr').nth(2)).toContainText('Polestar')

  //Delete a car from the table
  await page.getByRole('button', { name: 'Delete row' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.reload()
  await navigate()
  await expect(page.getByText('1 - 1 of 1')).toBeVisible()

  //Adding several cars to test pagination
  await page.locator('#rowsPerPage').selectOption('5')
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 2 of 2')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 4 of 4')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 5 of 5')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByText('6 - 6 of 6')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
  await page.getByRole('button', { name: 'Previous page' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Previous page' })
  ).toBeDisabled()
})
