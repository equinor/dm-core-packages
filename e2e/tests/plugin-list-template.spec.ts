import { Page, expect, test } from '@playwright/test'

test('Add list item using template', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$templates'
  )
  await page.getByRole('button', { name: 'edit' }).click()

  await page.getByTestId('task_list').getByLabel('Open in tab').click()
  await page.getByLabel('append-item').click()
  await page.getByRole('menuitem', { name: 'Template1' }).click()
  await page.getByTestId('SaveList').click()
  await page.getByTestId('expandListItem-3').click()
  await expect(page.getByTestId('form-text-widget-Task title:')).toHaveValue(
    'unnamed_task'
  )
  await expect(
    page.getByTestId('form-text-widget-Assigned to: (Optional)')
  ).toHaveValue('None yet')
  await expect(
    page.getByTestId('form-text-area-widget-Task description: (Optional)')
  ).toContainText('Add your description here.')
  await page.getByTestId('expandListItem-3').click()

  await page.getByLabel('append-item').click()
  await page.getByRole('menuitem', { name: 'Template2' }).click()
  await page.getByTestId('SaveList').click()
  await page.getByTestId('expandListItem-4').click()
  await page.getByTestId('form-text-widget-Task title:').fill('Fix bicycle')
  await page
    .getByTestId('form-text-widget-Assigned to: (Optional)')
    .fill('Anna')
  await page
    .getByTestId('form-text-area-widget-Task description: (Optional)')
    .fill('Patch tire and adjust brakes')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByRole('alert')).toHaveText(['Document updated'])

  await page.reload()
  await page.getByRole('button', { name: 'edit' }).click()
  await page.getByTestId('task_list').getByLabel('Open in tab').click()
  await expect(page.getByRole('tabpanel')).toContainText('Fix bicycle')
  await page.getByTestId('expandListItem-4').click()
  await expect(page.getByTestId('form-text-widget-Task title:')).toHaveValue(
    'Fix bicycle'
  )
  await expect(
    page.getByTestId('form-text-widget-Assigned to: (Optional)')
  ).toHaveValue('Anna')
  await expect(
    page.getByTestId('form-text-area-widget-Task description: (Optional)')
  ).toContainText('Patch tire and adjust brakes')
})
