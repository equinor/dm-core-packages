import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'grid' }).click()
  await page.getByRole('button', { name: 'car_grid' }).click()
  await page.getByRole('button', { name: 'RaceCenter' }).click()
})

test('Table non-referenced', async ({ page }) => {
  const cars = page.getByTestId('carsOnGrid')
  await expect(cars.getByText('Lando')).toBeVisible()
  await cars.getByRole('tab', { name: 'Q2' }).click()
  await expect(cars.getByText('Albon')).toBeVisible()
})

test('List reference resolved', async ({ page }) => {
  const tyreList = page.getByTestId('tyreList')
  await expect(tyreList.getByText('Hard')).toBeVisible()
  await tyreList
    .getByRole('row')
    .filter({ hasText: 'Soft' })
    .getByRole('button', { name: 'Expand item' })
    .click()
  await expect(
    tyreList
      .getByLabel('Tyre description')
      .getByText('Faster, but wears quicker.')
  ).toBeVisible()
})

test('List reference unresolved', async ({ page }) => {
  const tyreList = page.getByTestId('tyreList')
  await expect(
    tyreList.getByTestId('form-text-widget-referenceType')
  ).toHaveValue('link')
})

test('Nested form', async ({ page }) => {
  const nestedForm = page.getByTestId('nestedForm')
  await expect(nestedForm.getByLabel('Bar')).toHaveText('hello')
})
