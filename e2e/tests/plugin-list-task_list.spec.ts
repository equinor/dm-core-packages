import { expect, test } from '@playwright/test'

test('task list', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$taskList'
  )
  await page.getByRole('button', { name: 'edit Edit' }).click()
  await page.getByTestId('task_list').getByLabel('Open in tab').click()

  await test.step('Add a new task', async () => {
    const titleInput = page.getByTestId('form-text-widget-Task title:').last()
    const assignedInput = page
      .getByTestId('form-text-widget-Assigned to: (Optional)')
      .last()
    const descriptionTextarea = page
      .getByTestId('form-text-area-widget-Task description: (Optional)')
      .last()
    await page.getByRole('button', { name: 'Add to list' }).click()
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await expect(titleInput).toBeVisible()
    await titleInput.fill('Tax return')
    await assignedInput.fill('Maria Johnson')
    await descriptionTextarea.fill('Review and submit the tax return.')
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(page.getByText('Tax return', { exact: true })).toBeVisible()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await expect(titleInput).toHaveValue('Tax return')
    await expect(assignedInput).toHaveValue('Maria Johnson')
    await expect(descriptionTextarea).toHaveValue(
      'Review and submit the tax return.'
    )
    await page.getByTestId('expandListItem-3').click()
  })

  await test.step('Mark task as complete', async () => {
    await page.getByTestId('expandListItem-0').last().click()
    const contentWrapper = page.getByTestId('expandListItemContent-0').last()
    await expect(contentWrapper).toBeVisible()
    await expect(
      contentWrapper.getByRole('button', { name: 'Submit' })
    ).toBeVisible()
    await expect(
      contentWrapper.getByTestId('form-text-widget-Task title:')
    ).toHaveValue('Wash the car')
    await contentWrapper.getByText('Mark task as complete').click()
    await contentWrapper.getByRole('button', { name: 'Submit' }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .first()
      .click()
    await expect(contentWrapper.getByTestId('form-checkbox')).toBeChecked()
    await page.getByTestId('expandListItem-0').last().click()
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
    const task = page
      .getByRole('row')
      .filter({
        has: page.getByText('Paint the living room'),
      })
      .last()
    const downButton = task.getByRole('button', { name: 'Move down' })
    const upButton = task.getByRole('button', { name: 'Move up' })
    const saveButton = page.getByTestId('SaveList').last()
    await expect(task).toBeVisible()
    await expect(downButton).toBeVisible()
    await expect(upButton).toBeVisible()
    await expect(downButton).toBeDisabled()
    await expect(upButton).toBeEnabled()
    await upButton.click()
    await saveButton.click()
    await expect(saveButton).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(downButton).toBeEnabled()
    await expect(upButton).toBeEnabled()
    await upButton.click()
    await saveButton.click()
    await expect(saveButton).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(downButton).toBeEnabled()
    await expect(upButton).toBeDisabled()
    await downButton.click()
    await saveButton.click()
    await expect(saveButton).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(downButton).toBeEnabled()
    await expect(upButton).toBeEnabled()
    await downButton.click()
    await saveButton.click()
    await expect(saveButton).toBeDisabled()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(downButton).toBeDisabled()
    await expect(upButton).toBeEnabled()
  })

  await test.step('Edit a task', async () => {
    const contentWrapper = page.getByTestId('expandListItemContent-2').last()
    await page.getByTestId('expandListItem-2').last().click()
    await expect(page.getByRole('tab', { name: 'Edit' }).last()).toBeVisible()
    await contentWrapper
      .getByTestId('form-text-widget-Task title:')
      .fill('Paint the living room green')
    await contentWrapper
      .getByTestId('form-text-widget-Assigned to: (Optional)')
      .fill('Mark Johnson')
    await contentWrapper
      .getByTestId('form-text-area-widget-Task description: (Optional)')
      .fill('Remember to buy new brush.')
    await contentWrapper.getByRole('button', { name: 'Submit' }).click()
    await page.getByLabel('Close task_list').click()
    await page.getByTestId('task_list').getByLabel('Open in tab').click()
    await expect(
      page.getByText('Paint the living room green').last()
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Expand item', exact: true })
      .last()
      .click()
    await expect(
      contentWrapper.getByTestId('form-text-widget-Task title:')
    ).toHaveValue('Paint the living room green')
    await expect(
      contentWrapper.getByTestId('form-text-widget-Assigned to: (Optional)')
    ).toHaveValue('Mark Johnson')
    await expect(
      contentWrapper.getByTestId(
        'form-text-area-widget-Task description: (Optional)'
      )
    ).toHaveValue('Remember to buy new brush.')
    await page.getByRole('button', { name: 'Collapse item' }).last().click()
  })

  await test.step('Pagination', async () => {
    const contentArea = page.getByRole('tabpanel').last()
    await contentArea.getByLabel('Add to List').click()
    await contentArea.getByLabel('Add to List').click()
    await contentArea.getByLabel('Add to List').click()
    await expect(contentArea.getByText('6 - 6 of 6')).toBeVisible()
    await contentArea.getByRole('button', { name: 'Save' }).click()
    await expect(
      contentArea.getByRole('button', { name: 'Save' })
    ).toBeDisabled()
    await expect(
      contentArea.getByRole('button', { name: 'Next page' })
    ).toBeDisabled()
    await contentArea.getByRole('button', { name: 'Previous page' }).click()
    await expect(contentArea.getByText('1 - 5 of 6')).toBeVisible()
    await expect(
      contentArea.getByRole('button', { name: 'Previous page' })
    ).toBeDisabled()
    await expect(
      contentArea.getByRole('button', { name: 'Next page' })
    ).toBeEnabled()
  })
})
