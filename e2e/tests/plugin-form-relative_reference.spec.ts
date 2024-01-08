import { Page, expect, test } from '@playwright/test'

test('Relative reference', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'DemoDataSource' }).click()
  await page.getByRole('button', { name: 'plugins' }).click()
  await page.getByRole('button', { name: 'form' }).click()
  await page.getByRole('button', { name: 'relative_reference' }).click()
  await page.getByRole('button', { name: 'TestData' }).click()

  await expect(page.getByRole('code')).toBeVisible()
  await page.getByRole('button', { name: 'edit Edit' }).click()
  await expect(page.getByTestId('form-text-widget-Name')).toHaveValue(
    'TestData'
  )

  await test.step('Update root reference', async () => {
    await page.getByTestId('data').getByText('Data').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByTestId('form-number-widget-A Number').fill('1')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close data' }).click()

    await page.getByTestId('job').getByText('Job').click()
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
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close job' }).click()
    await page.getByTestId('data').getByText('Data').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '10'
    )
    await page.getByRole('button', { name: 'Close data' }).click()
  })

  await test.step('Update local reference', async () => {
    await page.getByTestId('task').getByText('Task').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-text-widget-Name').last()).toHaveValue(
      'ChildTask'
    )
    await page.getByTestId('data').getByText('Data').last().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '200'
    )
    await page.getByTestId('form-number-widget-A Number').fill('2')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close data' }).click()
    await page.getByTestId('job').getByText('Job').last().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByTestId('input').getByText('Input').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '2'
    )
    await page.getByRole('button', { name: 'Close task' }).click()
    await page.getByTestId('data').getByText('Data').click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '10'
    )
    await page.getByRole('button', { name: 'Close data' }).click()
  })

  await test.step('Nested local reference', async () => {
    await page.getByTestId('tasks').getByText('Tasks').click()
    await page.getByText('ChildTask local reference', { exact: true }).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByText('Data', { exact: true }).nth(1).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '300'
    )
    await page.getByTestId('form-number-widget-A Number').fill('3')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close data' }).click()
    await page.getByText('Job', { exact: true }).nth(3).click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByText('Input', { exact: true }).last().click()
    await expect(page.getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '3'
    )
    await page.getByTestId('expandListItem-0').click()
  })

  await test.step('Nested root reference', async () => {
    await page.getByText('ChildTask root reference', { exact: true }).click()
    await expect(page.locator('pre').nth(1).getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByText('Data', { exact: true }).nth(1).click()
    await expect(page.locator('pre').nth(2).getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '400'
    )
    await page.getByTestId('form-number-widget-A Number').fill('4')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await expect(page.getByRole('alert')).not.toBeVisible()
    await page.getByRole('button', { name: 'Close data' }).click()
    await page.getByText('Job', { exact: true }).nth(3).click()
    await expect(page.locator('pre').nth(2).getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByText('Input', { exact: true }).last().click()
    await expect(page.locator('pre').nth(3).getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '10'
    )
    await page.getByRole('button', { name: 'Close job' }).click()

    await page.getByText('Data', { exact: true }).nth(1).click()
    await expect(page.locator('pre').nth(2).getByRole('code')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).last().click()
    await expect(page.getByTestId('form-number-widget-A Number')).toHaveValue(
      '4'
    )
  })
})
