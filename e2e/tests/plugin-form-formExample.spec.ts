import { test, expect } from '@playwright/test'

test('NestedExample', async ({ page }) => {
  //Open form
  await page.goto('http://localhost:3000/')
  await page.getByText('plugins', { exact: true }).click()
  await page.getByText('form').click()
  await page.getByText('DemoDataSource/$formExample').click()

  //Add a list of string
  await page.getByTestId('add-listOfStrings').click()
  await page
    .locator('div')
    .filter({ hasText: /^A list of stringsRemoveRemoveRemoveAdd$/ })
    .getByTestId('form-textfield')
    .nth(2)
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^A list of stringsRemoveRemoveRemoveAdd$/ })
    .getByTestId('form-textfield')
    .nth(2)
    .fill('test')
  await expect(page.getByTestId('form-textfield')).toHaveText(['test'])
  await page.getByRole('button', { name: 'Remove' }).nth(2).click()
  await expect(page.getByTestId('form-textfield')).not.toContainText('test')
})
