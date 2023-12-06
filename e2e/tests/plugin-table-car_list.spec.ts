import { expect, test } from '@playwright/test'

test('Table car list example', async ({ page }) => {
  const navigate = async () => {
    await page.getByRole('button', { name: 'DemoDataSource' }).click()
    await page.getByRole('button', { name: 'plugins' }).click()
    await page.getByRole('button', { name: 'table' }).click()
    await page.getByRole('button', { name: 'car_list' }).click()
    await page.getByRole('button', { name: 'CarList' }).click()
    const lastTabPanel = page.getByRole('tabpanel').last()
    await expect(lastTabPanel).toBeVisible()
  }

  await page.goto('http://localhost:3000/')
  await navigate()

  await test.step('Add a new car by using expand', async () => {
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(2)
    await page
      .getByRole('button', { name: 'Open expandable row' })
      .last()
      .click()
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
  })

  await test.step('Open table item and edit', async () => {
    await page
      .getByRole('button', { name: 'Open in new tab', exact: true })
      .last()
      .click()
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
  })

  await test.step('Delete a car from the table', async () => {
    await page.getByRole('button', { name: 'Row actions' }).last().click()
    await page.getByRole('menuitem').first().click()
    await page.reload()
    await navigate()
    await expect(page.getByText('1 - 1 of 1')).not.toBeVisible()
  })

  await test.step('Adding several cars to test pagination', async () => {
    await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(1)
    await expect(page.getByText('1 - 1 of 1')).toBeVisible()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(2)
    await expect(page.getByText('1 - 2 of 2')).toBeVisible()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(3)
    await expect(page.getByText('1 - 3 of 3')).toBeVisible()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(4)
    await expect(page.getByText('1 - 4 of 4')).toBeVisible()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(5)
    await expect(page.getByText('1 - 5 of 5')).toBeVisible()
    await page.getByRole('button', { name: 'Add new row' }).click()
    await expect(
      page.getByRole('button', { name: 'Open expandable row' })
    ).toHaveCount(6)
    await expect(page.getByText('1 - 6 of 6')).toBeVisible()
    await page.locator('#rowsPerPage').selectOption('5')
    await page.getByRole('button', { name: 'Next page' }).click()
    await expect(page.getByText('6 - 6 of 6')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
    await page.getByRole('button', { name: 'Previous page' }).click()
    await expect(page.getByText('1 - 5 of 6')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Previous page' })
    ).toBeDisabled()
  })
})
