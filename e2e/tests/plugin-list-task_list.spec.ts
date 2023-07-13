import { test, expect, Page } from '@playwright/test'

//As the tests are building on each other, we need to run in serial mode.
test.describe.configure({ mode: 'serial' })

//Open the TaskList plugin before each test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('list').click()
  await page.getByText('task_list').click()
  await page.getByText('TaskList').click()
  await page.getByRole('tab', { name: 'task list' }).click()
})

//TODO REMOVE: Temporary function to reload page as we currently need to reload page to view saved itmes... (#153)
async function reloadPage(page: Page) {
  await page.reload()
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('list').click()
  await page.getByText('task_list').click()
  await page.getByText('TaskList').click()
  await page.getByRole('tab', { name: 'task list' }).click()
}

test('Add a new task', async ({ page }) => {
  await page.getByRole('button', { name: 'Add item' }).click()
  await expect(page.getByText('1 - 4 of 4')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await page.getByLabel('Task title:').fill('Tax return')
  await page.getByLabel('Assigned to: (optional)').fill('Maria Johnson')
  await page
    .getByLabel('Task description: (optional)')
    .fill('Review and submit the tax return.')
  await page.getByTestId('form-submit').click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(page.getByText('Tax returnMaria Johnson').last()).toBeVisible() //TODO: Remove last() when saving issue is solved (#258)
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByLabel('Task title:')).toHaveValue('Tax return')
  await expect(page.getByLabel('Assigned to: (optional)')).toHaveValue(
    'Maria Johnson'
  )
  await expect(page.getByLabel('Task description: (optional)')).toHaveValue(
    'Review and submit the tax return.'
  )
  await page.getByRole('button', { name: 'Close item' }).last().click()

  //Temp workaround to clean up duplicates due to saving issue in #258.
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
})

test('Mark task as complete', async ({ page }) => {
  await page.getByRole('button', { name: 'Open item' }).first().click()
  await expect(page.getByLabel('Task title:')).toHaveValue('Wash the car')
  await page.getByText('Mark task as complete').click()
  await page.getByTestId('form-submit').click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await page.getByRole('button', { name: 'Open item' }).first().click()
  await expect(page.getByTestId('form-checkbox')).toBeChecked()
  await page.getByRole('button', { name: 'Close item' }).first().click()

  //Temp workaround to clean up duplicates due to saving issue in #258.
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
})

test('Delete a task', async ({ page }) => {
  await expect(
    page.getByRole('paragraph').getByText('Tax return')
  ).toBeVisible()
  await page
    .locator('div')
    .filter({
      hasText: /^Open itemTax returnMaria JohnsonMove upMove DownDelete$/,
    })
    .getByRole('button', { name: 'Delete' })
    .click()
  await page.getByRole('button', { name: 'Save' }).click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page.getByRole('paragraph').getByText('Tax return')
  ).not.toBeVisible()
})

test('Move task up and down', async ({ page }) => {
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move down' })
  ).toBeDisabled()
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move up' })
  ).toBeEnabled()
  await page
    .locator('div')
    .filter({
      hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
    })
    .getByRole('button', { name: 'Move up' })
    .click()
  await page.getByRole('button', { name: 'Save' }).click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move down' })
  ).toBeEnabled()
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move up' })
  ).toBeEnabled()
  await page
    .locator('div')
    .filter({
      hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
    })
    .getByRole('button', { name: 'Move up' })
    .click()
  await page.getByRole('button', { name: 'Save' }).click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move down' })
  ).toBeEnabled()
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move up' })
  ).toBeDisabled()
  await page
    .locator('div')
    .filter({
      hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
    })
    .getByRole('button', { name: 'Move down' })
    .click()
  await page.getByRole('button', { name: 'Save' }).click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move down' })
  ).toBeEnabled()
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move up' })
  ).toBeEnabled()
  await page
    .locator('div')
    .filter({
      hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
    })
    .getByRole('button', { name: 'Move down' })
    .click()
  await page.getByRole('button', { name: 'Save' }).click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move down' })
  ).toBeDisabled()
  await expect(
    page
      .locator('div')
      .filter({
        hasText: /^Open itemPaint the living roomMove upMove DownDelete$/,
      })
      .getByRole('button', { name: 'Move up' })
  ).toBeEnabled()
})

test('Edit a task', async ({ page }) => {
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible()
  await page.getByLabel('Task title:').fill('Paint the living room green')
  await page.getByLabel('Assigned to: (optional)').fill('Mark Johnson')
  await page
    .getByLabel('Task description: (optional)')
    .fill('Remember to buy new brush.')
  await page.getByTestId('form-submit').click()
  await reloadPage(page) //TODO: Remove when #153 is solved.
  await expect(
    page.getByText('Paint the living room greenMark Johnson').last()
  ).toBeVisible() //TODO: Remove last() when saving issue is solved (#258)
  await page.getByRole('button', { name: 'Open item' }).last().click()
  await expect(page.getByLabel('Task title:')).toHaveValue(
    'Paint the living room green'
  )
  await expect(page.getByLabel('Assigned to: (optional)')).toHaveValue(
    'Mark Johnson'
  )
  await expect(page.getByLabel('Task description: (optional)')).toHaveValue(
    'Remember to buy new brush.'
  )
  await page.getByRole('button', { name: 'Close item' }).last().click()

  //Temp workaround to clean up duplicates due to saving issue in #258.
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Save' }).click()
})

test('Pagination', async ({ page }) => {
  await page.locator('#rowsPerPage').selectOption('5')
  await expect(
    page.getByRole('button', { name: 'Previous page' })
  ).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
  await page.getByRole('button', { name: 'Add item' }).click()
  await expect(page.getByText('1 - 4 of 4')).toBeVisible()
  await page.getByRole('button', { name: 'Add item' }).click()
  await expect(page.getByText('1 - 5 of 5')).toBeVisible()
  await page.getByRole('button', { name: 'Add item' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByText('6 - 6 of 6')).toBeVisible()
  //await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled() //BUG #258
  await page.getByRole('button', { name: 'Previous page' }).click()
  await expect(page.getByText('1 - 5 of 6')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Previous page' })
  ).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Next page' })).toBeEnabled()
})
