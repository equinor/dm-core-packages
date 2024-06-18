import { expect, test } from '@playwright/test'

test('Relative reference', async ({ page }) => {
  test.setTimeout(120000)

  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$relativeReference'
  )

  await expect(page.getByRole('code')).toBeVisible()
  await page.getByRole('button', { name: 'edit Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue(
    'TestData'
  )

  await test.step('Update root reference', async () => {
    await page.getByTestId('data').getByRole('button', { name: 'Data' }).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByTestId('form-number-widget-A Number').fill('1')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close data' }).click()

    await page.getByTestId('job').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByTestId('input').getByText('Input').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '1'
    )

    await page.getByTestId('form-number-widget-A Number').fill('10')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'Close job' }).click()
    await page.waitForTimeout(5000) // Wait for react-query cache to expire
    await page.getByTestId('data').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '10'
    )
    await page.getByRole('button', { name: 'Close data' }).click()
  })

  await test.step('Update local reference', async () => {
    await page.getByTestId('task').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-text-widget-Name').last()).toHaveValue(
      'ChildTask'
    )
    await page.getByTestId('data').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '200'
    )
    await page.getByTestId('form-number-widget-A Number').fill('2')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'Close data' }).click()
    await page.getByTestId('job').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByTestId('input').getByText('Input').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '2'
    )
    await page.getByRole('button', { name: 'Close task' }).click()
    await page.getByTestId('data').getByRole('button').first().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '10'
    )
    await page.getByRole('button', { name: 'Close data' }).click()
  })

  await test.step('Nested local reference', async () => {
    const area = page.getByTestId(
      'enabled:dmss://DemoDataSource/$relativeReference'
    )
    await area.getByTestId('tasks').getByRole('button').first().click()
    await area.getByTestId('expandListItem-0').last().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await area.getByTestId('data').first().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await expect(area.getByTestId('form-number-widget-A Number')).toHaveValue(
      '300'
    )
    await area.getByTestId('form-number-widget-A Number').fill('3')
    await area.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await area.getByRole('button', { name: 'Close data' }).click()
    await area.getByTestId('job').first().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await area.getByTestId('input').getByRole('button').first().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await expect(area.getByTestId('form-number-widget-A Number')).toHaveValue(
      '3'
    )
    // await page.getByTestId('expandListItem-0').click()
  })

  await test.step('Nested root reference', async () => {
    const area = page.getByTestId(
      'enabled:dmss://DemoDataSource/$relativeReference'
    )
    await area.getByTestId('expandListItem-1').click()
    await expect(area.locator('pre').getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await area.getByText('Data').last().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await expect(
      area.getByTestId('form-number-widget-A Number').last()
    ).toHaveValue('400')
    await area.getByTestId('form-number-widget-A Number').last().fill('4')
    await area.getByRole('button', { name: 'Submit' }).last().click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await area.getByRole('button', { name: 'Close data' }).click()
    await area.getByRole('button', { name: 'Job Optional' }).last().click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await area.getByText('Input', { exact: true }).nth(1).click()
    await expect(area.getByRole('code')).toBeVisible()
    await area.getByRole('button', { name: 'Edit' }).last().click()
    await expect(
      area.getByTestId('form-number-widget-A Number').last()
    ).toHaveValue('10')
  })
})
