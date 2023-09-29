import { expect, test } from '@playwright/test'

test('View selector - car garage', async ({ page }) => {
  // Open self and verify page content and the sidebar:
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'view_selector' }).click()
  await page.getByRole('button', { name: 'car_garage' }).click()
  await page.getByRole('button', { name: 'carGarage' }).click()
  await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
  await expect(page.getByLabel('Description')).toHaveValue(
    'Here you will find detailed information about the cars in our garage'
  )

  // Collapse and expand sidebar:
  await page.getByRole('tab', { name: 'Self' }).click()
  await page.getByRole('button', { name: 'Collapse' }).click()
  await expect(page.getByRole('tab', { name: 'Self' })).not.toBeVisible()
  await expect(page.getByRole('tab', { name: 'Audi' })).not.toBeVisible()
  await expect(page.getByRole('tab', { name: 'Volvo' })).not.toBeVisible()
  await page.getByRole('tab').nth(1).click()
  await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue('Audi')
  await page.getByRole('tab').first().click()
  await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
  await page.getByRole('button', { name: 'Expand' }).click()
  await expect(page.getByRole('tab', { name: 'Self' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Audi' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Volvo' })).toBeVisible()

  // Open a car and verify that tabs opens within the car:
  await page.getByRole('tab', { name: 'Audi' }).click()
  await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()

  await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue('Audi')

  await page
    .getByRole('group', { name: 'View owner details and history' })
    .getByRole('button', { name: 'Open in tab' })
    .click()
  await expect(
    page.getByRole('tab', { name: 'Owner details' })
  ).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tab', { name: 'Owner history' })).toBeVisible()
  await expect(
    page.locator('form').filter({ hasText: 'Name of Owner' }).locator('#name')
  ).toHaveValue('Aiden')
  await page.getByText('Owner history').click()
  await expect(
    page.getByRole('tab', { name: 'group Owner history' })
  ).toHaveAttribute('aria-selected', 'true')

  //Add earlier owner:
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('textbox').last().fill(' Joanna')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).click()

  // Select "home" and then open "technical". Verify that both owner and techincal tabs are open and selectable. Check also sub-tabs
  await page.getByRole('tab', { name: 'Home' }).click()
  await page
    .getByRole('group', { name: 'View technical information' })
    .getByRole('button', { name: 'Open in tab' })
    .click()
  await expect(page.getByRole('tab', { name: 'Technical' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(page.getByRole('tab', { name: 'EU control' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(page.getByRole('tab', { name: 'car Dimensions' })).toBeVisible()

  await page
    .getByTestId('nextControl')
    .getByTestId('form-textfield')
    .fill('2025-06-31')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).first().click()
  await page.getByRole('tab', { name: 'Dimensions' }).click()
  await page.getByTestId('length').getByTestId('form-textfield').fill('4250')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])
  await page.getByRole('button', { name: 'close', exact: true }).first().click()

  // Open another car and se that no other tabs than "home" is open:
  await page.getByRole('tab', { name: 'Volvo' }).click()
  await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Owner', exact: true })
  ).not.toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Owner details' })
  ).not.toBeVisible()
  await expect(
    page.getByRole('tab', { name: 'Owner history' })
  ).not.toBeVisible()

  // Testing that tabs are still open for the first car when going back and forth:
  await page.getByRole('tab', { name: 'Audi' }).click()
  await expect(page.getByRole('tab', { name: 'Owner' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Technical' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(page.getByRole('tab', { name: 'EU control' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Dimensions' })).toHaveAttribute(
    'aria-selected',
    'true'
  )

  // Testing that saving one car does not ovveride the other car:
  await page.getByRole('tab', { name: 'Volvo' }).click()
  await page
    .getByRole('group', { name: 'View technical information' })
    .getByRole('button', { name: 'Open in tab' })
    .click()

  await expect(
    page.getByTestId('nextControl').getByRole('textbox')
  ).toHaveValue('2025-06-01')
  await page.getByRole('tab', { name: 'Dimensions' }).click()
  await expect(page.getByTestId('length').getByRole('textbox')).toHaveValue(
    '4500'
  )
  await page.getByRole('tab', { name: 'Home' }).click()
  await page
    .getByRole('group', { name: 'View owner details and history' })
    .getByRole('button', { name: 'Open in tab' })
    .click()
  await page.getByRole('tab', { name: 'Owner history' }).click()
  await expect(page.getByRole('textbox').first()).toHaveValue('Jack')
  await expect(page.getByRole('textbox').last()).toHaveValue('Maria')

  // Close tabs:
  await page.getByRole('button', { name: 'Close Owner' }).click()
  await expect(page.getByRole('tab', { name: 'Technical' })).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(page.getByRole('tab', { name: 'Owner' })).not.toBeVisible()
})
