import { test, expect } from '@playwright/test'

test('View selector - car garage', async ({ page }) => {
  // Open self and verify page content and the sidebar:
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('view_selector').click()
  await page.getByText('car_garage').click()
  await page.getByText('carGarage').click()
  await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
  await expect(page.getByLabel('Description')).toHaveValue(
    'Here you will find detailed information about the cars in our garage'
  )

  // Collapse and expand sidebar:
  await page.getByRole('button').first().click()
  await expect(page.locator('a').filter({ hasText: 'Self' })).not.toBeVisible()
  await expect(page.locator('a').filter({ hasText: 'Audi' })).not.toBeVisible()
  await expect(page.locator('a').filter({ hasText: 'Volvo' })).not.toBeVisible()
  await page.locator('a').nth(1).click()
  await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue('Audi')
  await page.locator('a').first().click()
  await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
  await page.getByRole('button').first().click()
  await expect(page.locator('a').filter({ hasText: 'Self' })).toBeVisible()
  await expect(page.locator('a').filter({ hasText: 'Audi' })).toBeVisible()
  await expect(page.locator('a').filter({ hasText: 'Volvo' })).toBeVisible()

  // Open a car and verify that tabs opens within the car:
  await page.locator('a').filter({ hasText: 'Audi' }).click()
  await expect(page.getByRole('tab', { name: 'home Home' })).toBeVisible()
  await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue('Audi')
  await page
    .getByText('View owner details and historyOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect(
    page.getByRole('tab', { name: 'person Owner details' })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tab', { name: 'group Owner history' })
  ).toBeVisible()
  await expect(
    page.locator('form').filter({ hasText: 'Name of Owner' }).locator('#name')
  ).toHaveValue('Aiden')
  await page.getByText('Owner history').click()
  await expect(
    page.getByRole('tab', { name: 'group Owner history' })
  ).toHaveAttribute('aria-selected', 'true')

  //Add earlier owner:
  await page.getByTestId('add-earlierOwners').click()
  await page.getByRole('textbox').last().fill(' Joanna')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()

  // Select "home" and then open "technical". Verify that both owner and techincal tabs are open and selectable. Check also sub-tabs
  await page.getByRole('tab', { name: 'home Home' }).click()
  await page
    .getByText('View technical informationOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await expect(
    page.getByRole('tab', { name: 'Technical Close Technical' })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tab', { name: 'check EU control' })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tab', { name: 'car Dimensions' })).toBeVisible()

  await page
    .getByTestId('nextControl')
    .getByTestId('form-textfield')
    .fill('2025-06-31')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).first().click()
  await page.getByRole('tab', { name: 'car Dimensions' }).click()
  await page.getByTestId('length').getByTestId('form-textfield').fill('4250')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).first().click()

  // Open another car and se that no other tabs than "home" is open:
  await page.locator('a').filter({ hasText: 'Volvo' }).click()
  await expect(page.getByRole('tab', { name: 'home Home' })).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Owner', exact: true })
  ).not.toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'person Owner details' })
  ).not.toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'group Owner history' })
  ).not.toBeVisible()

  // Testing that tabs are still open for the first car when going back and forth:
  await page.locator('a').filter({ hasText: 'Audi' }).click()
  await expect(
    page.getByRole('tab', { name: 'Owner Close Owner' })
  ).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Technical Close Technical' })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tab', { name: 'check EU control' })
  ).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'car Dimensions' })
  ).toHaveAttribute('aria-selected', 'true')

  // Testing that saving one car does not ovveride the other car:
  await page.locator('a').filter({ hasText: 'Volvo' }).click()
  await page
    .getByText('View technical informationOpen')
    .getByRole('button', { name: 'Open' })
    .click()

  await expect(
    page.getByTestId('nextControl').getByRole('textbox')
  ).toHaveValue('2025-06-01')
  await page.getByRole('tab', { name: 'car Dimensions' }).click()
  await expect(page.getByTestId('length').getByRole('textbox')).toHaveValue(
    '4500'
  )
  await page.getByRole('tab', { name: 'home Home' }).click()
  await page
    .getByText('View owner details and historyOpen')
    .getByRole('button', { name: 'Open' })
    .click()
  await page.getByRole('tab', { name: 'group Owner history' }).click()
  await expect(page.getByRole('textbox').first()).toHaveValue('Jack')
  await expect(page.getByRole('textbox').last()).toHaveValue('Maria')

  // Close tabs:
  await page.getByRole('button', { name: 'Close Owner' }).click()
  await expect(
    page.getByRole('tab', { name: 'Technical Close Technical', exact: true })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.getByRole('tab', { name: 'Owner', exact: true })
  ).not.toBeVisible()
})
