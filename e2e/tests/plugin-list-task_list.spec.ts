import { expect, test } from '@playwright/test'

test('task list', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$taskList'
  )
  await page.getByRole('button', { name: 'edit Edit' }).click()
  await page.getByTestId('task_list').getByLabel('Open in tab').click()

  await test.step('Add a new task', async () => {
    await page.getByLabel('append-item').click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await page.getByTestId('form-text-widget-Task title:').fill('Tax return')
    await page.getByLabel('Assigned to: (Optional)').fill('Maria Johnson')
    await page
      .getByLabel('Task description: (Optional)')
      .fill('Review and submit the tax return.')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(page.getByText('Tax return', { exact: true })).toBeVisible()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await expect(page.getByTestId('form-text-widget-Task title:')).toHaveValue(
      'Tax return'
    )
    await expect(page.getByLabel('Assigned to: (Optional)')).toHaveValue(
      'Maria Johnson'
    )
    await expect(page.getByLabel('Task description: (Optional)')).toHaveValue(
      'Review and submit the tax return.'
    )
    await page
      .getByRole('button', { name: 'Minimize item', exact: true })
      .last()
      .click()
  })

  await test.step('Mark task as complete', async () => {
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .first()
      .click()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
    await expect(page.getByTestId('form-text-widget-Task title:')).toHaveValue(
      'Wash the car'
    )
    await page.getByText('Mark task as complete').click()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .first()
      .click()
    await expect(page.getByTestId('form-checkbox')).toBeVisible()
    await expect(page.getByTestId('form-checkbox')).toBeChecked()
    await page
      .getByRole('button', { name: 'Minimize item', exact: true })
      .first()
      .click()
  })

  await test.step('Delete a task', async () => {
    await expect(
      page.getByRole('paragraph').getByText('Tax return')
    ).toBeVisible()

    await page
      .getByRole('row')
      .filter({ has: page.getByText('Tax return', { exact: true }) })
      .getByRole('button', { name: 'Delete' })
      .click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page.getByRole('paragraph').getByText('Wash the car')
    ).toBeVisible()
    await expect(
      page.getByRole('paragraph').getByText('Tax return')
    ).not.toBeVisible()
  })

  await test.step('Move task up and down', async () => {
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move down' })
    ).toBeDisabled()

    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move up' })
    ).toBeEnabled()

    await page
      .getByRole('row')
      .filter({ has: page.getByText('Paint the living room', { exact: true }) })
      .getByRole('button', { name: 'Move up' })
      .click()
    await page.getByTestId('SaveList').click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move down' })
    ).toBeEnabled()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move up' })
    ).toBeEnabled()
    await page
      .getByRole('row')
      .filter({ has: page.getByText('Paint the living room', { exact: true }) })
      .getByRole('button', { name: 'Move up' })
      .click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move down' })
    ).toBeEnabled()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move up' })
    ).toBeDisabled()
    await page
      .getByRole('row')
      .filter({ has: page.getByText('Paint the living room', { exact: true }) })
      .getByRole('button', { name: 'Move down' })
      .click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move down' })
    ).toBeEnabled()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move up' })
    ).toBeEnabled()
    await page
      .getByRole('row')
      .filter({ has: page.getByText('Paint the living room', { exact: true }) })
      .getByRole('button', { name: 'Move down' })
      .click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move down' })
    ).toBeDisabled()
    await expect(
      page
        .getByRole('row')
        .filter({
          has: page.getByText('Paint the living room', { exact: true }),
        })
        .getByRole('button', { name: 'Move up' })
    ).toBeEnabled()
  })

  await test.step('Edit a task', async () => {
    await page.getByTestId('expandListItem-2').click()
    await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible()
    await page
      .getByTestId('form-text-widget-Task title:')
      .fill('Paint the living room green')
    await page.getByLabel('Assigned to: (Optional)').fill('Mark Johnson')
    await page
      .getByLabel('Task description: (Optional)')
      .fill('Remember to buy new brush.')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('alert')).toHaveText(['Document updated'])
    await page.getByRole('button', { name: 'close', exact: true }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page.getByText('Paint the living room green', { exact: true })
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await expect(page.getByTestId('form-text-widget-Task title:')).toHaveValue(
      'Paint the living room green'
    )
    await expect(page.getByLabel('Assigned to: (Optional)')).toHaveValue(
      'Mark Johnson'
    )
    await expect(page.getByLabel('Task description: (Optional)')).toHaveValue(
      'Remember to buy new brush.'
    )
    await page.getByRole('button', { name: 'Minimize item' }).last().click()
  })

  await test.step('Pagination', async () => {
    await page.getByLabel('append-item').click()
    await page.getByLabel('append-item').click()
    await page.getByLabel('append-item').click()
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
    await expect(page.getByRole('button', { name: 'Next page' })).toBeEnabled()
  })
})
