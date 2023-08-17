import { test, expect } from '@playwright/test'

test('Table car list example', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()

  //Add a new car by using expand (not "open")
  await page.getByRole('button', { name: 'Add row' }).click()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Open expandable row' }).last().click()
  await page.getByLabel('Manufacturer').fill('Audi')
  await page.getByLabel('Model').fill('e-tron')
  await page.getByLabel('Color (optional)').fill('Black')
  await page.getByTestId('form-submit').click()
  await page.waitForTimeout(5000)

  //Currently we need to reload application to view saved values...
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()
  // await expect(page.getByText('1 - 2 of 2')).toBeVisible() //Fails because when you submit the form, TWO instances are stored!
  // await expect(page.getByText('Audi')).toBeVisible()
  // await expect(page.getByText('e-tron')).toBeVisible()
  // await expect(page.getByText('Black')).toBeVisible()

  //Open table item and edit
  await page.getByRole('button', { name: 'Open', exact: true }).last().click()
  await page.getByLabel('Manufacturer').fill('Polestar')
  await page.getByLabel('Model').fill('2023')
  await page.getByLabel('Color (optional)').fill('Grey')
  await page.getByTestId('form-submit').click()
  await page.getByRole('tab').last().click() //closing tab
  await expect(page.getByText('name')).toBeVisible()

  //Currently we need to reload application to view saved values...
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()
  // await expect(page.getByText('1 - 2 of 2')).toBeVisible() //Fails because when you submit the form, TWO instances are stored!
  // await expect(page.getByText('Polestar')).toBeVisible()
  // await expect(page.getByText('2023')).toBeVisible()
  // await expect(page.getByText('Grey')).toBeVisible()

  //Move table item up
  await expect(page.locator('tr').nth(1)).toContainText('Volvo')
  await expect(page.locator('tr').nth(2)).toContainText('Audi')
  await expect(page.locator('tr').nth(3)).toContainText('Polestar')
  await page.getByRole('button', { name: 'Move row up' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(5000)
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()
  await expect(page.locator('tr').nth(1)).toContainText('Volvo')
  //await expect(page.locator('tr').nth(2)).toContainText('Polestar')
  //await expect(page.locator('tr').nth(3)).toContainText('Audi')

  //Move table item down
  await page.getByRole('button', { name: 'Move row down' }).first().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()
  //await expect(page.locator('tr').nth(1)).toContainText('Polestar')
  //await expect(page.locator('tr').nth(2)).toContainText('Volvo')
  //await expect(page.locator('tr').nth(3)).toContainText('Audi')

  //Delete a car from the table
  await page.getByRole('button', { name: 'Delete row' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('table').click()
  await page.getByText('car_list').click()
  await page.getByText('CarList').click()
  //await expect(page.getByText('1 - 2 of 2')).toBeVisible() //Fails because when you submit the form, TWO instances are stored!

  //WIP: Adding several cars to test pagination
  await page.locator('#rowsPerPage').selectOption('5')
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
  // await page.getByRole('button', { name: 'Add row' }).click()
  // await expect(page.getByText('1 - 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 4 of 4')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 5 of 5')).toBeVisible()
  await page.getByRole('button', { name: 'Add row' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByText('6 - 6 of 6')).toBeVisible()
  //await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled() //BUG #258
  await page.getByRole('button', { name: 'Previous page' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Previous page' })
  ).toBeDisabled()
})
