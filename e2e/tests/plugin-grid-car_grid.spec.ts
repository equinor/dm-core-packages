import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$gridRaceCenter'
  )
})

test('Check rendered children items', async ({ page }) => {
  const cars = page.getByTestId('carsOnGrid')
  await expect(cars.getByText('Lando')).toBeVisible()
  await cars.getByRole('tab', { name: 'Q2' }).click()
  await expect(cars.getByText('Albon')).toBeVisible()
  const tyreList = page.getByTestId('tyreList')
  await expect(tyreList.getByText('Hard')).toBeVisible()
})

test('Test Nested form render', async ({ page }) => {
  const nestedForm = page.getByTestId('nestedForm')
  await expect(nestedForm.getByLabel('Bar')).toHaveText('hello')
})
