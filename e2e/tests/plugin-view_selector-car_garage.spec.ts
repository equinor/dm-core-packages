import { expect, test } from '@playwright/test'

test('View selector - car garage', async ({ page }) => {
  await test.step('Open self and verify page content', async () => {
    await page.goto(
      'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$carGarage'
    )
    await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
    await expect(page.getByLabel('Description')).toHaveValue(
      'Here you will find detailed information about the cars in our garage'
    )
  })

  // TODO: EDS ISSUE - Sidebar open state can't be controlled. Contact eds-team and wait for a solution or create own sidebar

  /*   await test.step('Collapse and expand sidebar', async () => {
    await page.getByRole('tab', { name: 'Self' }).click()
    await page.getByRole('button', { name: 'Collapse sidebar' }).click()
    await expect(page.getByRole('tab', { name: 'Self' })).not.toBeVisible()
    await expect(page.getByRole('tab', { name: 'Audi' })).not.toBeVisible()
    await expect(page.getByRole('tab', { name: 'Volvo' })).not.toBeVisible()
    await page.getByRole('tab').nth(1).click()
    await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue(
      'Audi'
    )
    await page.getByRole('tab').first().click()
    await expect(page.getByLabel('Name')).toHaveValue('CarGarage')
    await page.getByRole('button', { name: 'Expand sidebar' }).click()
    await expect(page.getByRole('tab', { name: 'Self' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Audi' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Volvo' })).toBeVisible()
  }) */

  await test.step('Open a car and verify that tabs opens within the car', async () => {
    await page.getByRole('tab', { name: 'Audi' }).click()
    await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible()

    await expect(page.getByRole('tabpanel').locator('#name')).toHaveValue(
      'Audi'
    )

    await page.getByTestId('Owner').getByLabel('Open in tab').click()
    await expect(
      page.getByRole('tab', { name: 'Owner details' })
    ).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: 'Owner history' })).toBeVisible()
    await expect(
      page
        .getByRole('tabpanel')
        .last()
        .getByTestId('form-text-widget-Name of Owner')
    ).toHaveValue('Aiden')
    await page.getByText('Owner history').last().click()
    await expect(
      page.getByRole('tab', { name: 'group Owner history' })
    ).toHaveAttribute('aria-selected', 'true')
  })

  await test.step('Verify tabs are open and selectable', async () => {
    await page.getByRole('tab', { name: 'Home' }).click()
    await page.getByTestId('Technical').getByLabel('Open in tab').click()
    await expect(page.getByRole('tab', { name: 'Technical' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(page.getByRole('tab', { name: 'EU control' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(
      page.getByRole('tab', { name: 'car Dimensions' })
    ).toBeVisible()

    await page
      .getByTestId('form-text-widget-Next control date')
      .last()

      .fill('2025-06-31')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page
      .getByRole('button', { name: 'close', exact: true })
      .first()
      .click()
    await page.getByRole('tab', { name: 'Dimensions' }).click()
    await page
      .getByTestId('form-number-widget-Length (mm) (Optional)')
      .last()
      .fill('4250')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page
      .getByRole('button', { name: 'close', exact: true })
      .first()
      .click()
  })

  await test.step('Open another car and see that no other tabs than "home" is open', async () => {
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
  })

  await test.step('Testing that tabs are reset for the first car when going back and forth', async () => {
    await page.getByRole('tab', { name: 'Audi' }).click()
    await expect(page.getByRole('tab', { name: 'Owner' })).not.toBeVisible()
  })

  await test.step('Testing that saving one car does not override the other car', async () => {
    await page.getByRole('tab', { name: 'Volvo' }).click()
    await page.getByTestId('Technical').getByLabel('Open in tab').click()

    await expect(
      page.getByTestId('form-text-widget-Next control date').last()
    ).toHaveValue('2025-06-01')
    await page.getByRole('tab', { name: 'Dimensions' }).click()
    await expect(
      page.getByTestId('form-number-widget-Length (mm) (Optional)').last()
    ).toHaveValue('4500')
    await page.getByRole('tab', { name: 'Home' }).click()
    await page.getByTestId('Owner').getByLabel('Open in tab').click()
    await expect(
      page.getByTestId('form-text-widget-Name of Owner').last()
    ).toBeVisible()
    await page.getByRole('tab', { name: 'Owner history' }).click()
    await expect(page.getByRole('textbox').first()).toHaveValue('Jack')
    await expect(page.getByRole('textbox').last()).toHaveValue('Maria')
  })

  await test.step('Close tabs', async () => {
    await page.getByRole('button', { name: 'Close Owner' }).click()
    await expect(page.getByRole('tab', { name: 'Technical' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect(page.getByRole('tab', { name: 'Owner' })).not.toBeVisible()
  })
})
