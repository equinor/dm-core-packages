import { expect, test } from '@playwright/test'

test('Add list item using template', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$templates'
  )
  await page.getByRole('button', { name: 'edit' }).click()
  await page.getByTestId('task_list').getByLabel('Open in tab').click()

  const contentArea = page.getByTestId(
    'enabled:dmss://DemoDataSource/$templates'
  )
  await expect(contentArea).toBeVisible({ timeout: 30000 })
  await contentArea.getByRole('button', { name: 'Add to list' }).click()
  await page.getByRole('menuitem', { name: 'Template1' }).click()
  await contentArea.getByTestId('SaveList').click()
  await contentArea.getByTestId('expandListItem-3').click()
  const taskArea = contentArea.getByTestId('expandListItemContent-3')
  await expect(
    taskArea.getByTestId('form-text-widget-Task title:')
  ).toBeVisible()
  await expect(
    taskArea.getByTestId('form-text-widget-Task title:')
  ).toHaveValue('unnamed_task')
  await expect(
    taskArea.getByTestId('form-text-widget-Assigned to: (Optional)')
  ).toHaveValue('None yet')
  await expect(
    taskArea.getByTestId('form-text-area-widget-Task description: (Optional)')
  ).toContainText('Add your description here.')
  await contentArea.getByTestId('expandListItem-3').click()

  await contentArea.getByRole('button', { name: 'Add to list' }).click()
  await page.getByRole('menuitem', { name: 'Template2' }).click()
  await contentArea.getByTestId('SaveList').click()
  await contentArea.getByTestId('expandListItem-4').click()
  const openTaskArea = contentArea.getByTestId('expandListItemContent-4')
  await openTaskArea
    .getByTestId('form-text-widget-Task title:')
    .fill('Fix bicycle')
  await openTaskArea
    .getByTestId('form-text-widget-Assigned to: (Optional)')
    .fill('Anna')
  await openTaskArea
    .getByTestId('form-text-area-widget-Task description: (Optional)')
    .fill('Patch tire and adjust brakes')
  await openTaskArea.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])

  await page.reload()
  await expect(page.getByRole('code')).toBeVisible()
  await page.getByRole('button', { name: 'edit' }).click()
  await page.getByTestId('task_list').getByLabel('Open in tab').click()
  await expect(contentArea).toContainText('Fix bicycle')
  await contentArea.getByTestId('expandListItem-4').click()
  await expect(
    openTaskArea.getByTestId('form-text-widget-Task title:')
  ).toHaveValue('Fix bicycle')
  await expect(
    openTaskArea.getByTestId('form-text-widget-Assigned to: (Optional)')
  ).toHaveValue('Anna')
  await expect(
    openTaskArea.getByTestId(
      'form-text-area-widget-Task description: (Optional)'
    )
  ).toContainText('Patch tire and adjust brakes')
})
