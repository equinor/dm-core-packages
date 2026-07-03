# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: plugin-form-UncontainedObject.spec.ts >> uncontainedObject
- Location: tests/plugin-form-UncontainedObject.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/view/?documentId=dmss://DemoDataSource/$UncontainedObject
Call log:
  - navigating to "http://localhost:3000/view/?documentId=dmss://DemoDataSource/$UncontainedObject", waiting until "load"

```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test'
  2   | 
  3   | test('uncontainedObject', async ({ page }) => {
> 4   |   await page.goto(
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/view/?documentId=dmss://DemoDataSource/$UncontainedObject
  5   |     'http://localhost:3000/view/?documentId=dmss://DemoDataSource/$UncontainedObject'
  6   |   )
  7   | 
  8   |   const dialog = page.getByRole('dialog')
  9   |   const selectJohn = async () => {
  10  |     await expect(dialog).toBeVisible()
  11  |     await dialog.getByRole('button', { name: 'DemoDataSource' }).click()
  12  |     await dialog.getByRole('button', { name: 'plugins' }).click()
  13  |     await dialog.getByRole('button', { name: 'form' }).click()
  14  |     await dialog.getByRole('button', { name: 'uncontained_object' }).click()
  15  |     await dialog.getByRole('button', { name: 'UncontainedObject' }).click()
  16  |     await dialog.getByRole('button', { name: 'employees' }).click()
  17  |     await dialog
  18  |       .getByRole('listitem')
  19  |       .filter({ hasText: 'employees' })
  20  |       .last() // Get innermost list
  21  |       .getByRole('button', { name: 'John' })
  22  |       .hover()
  23  |     await dialog.getByTestId('select-single-entity-button').click()
  24  |     await expect(dialog).not.toBeVisible()
  25  |   }
  26  | 
  27  |   await test.step('Assert CEO', async () => {
  28  |     await page.getByTestId('ceo').getByRole('button', { name: 'Open' }).click()
  29  |     await expect(page.getByRole('code').getByText('Miranda')).toBeVisible()
  30  |     await expect(page.getByRole('code').getByText('1337')).toBeVisible()
  31  |     await page.getByRole('button', { name: 'Close ceo' }).click()
  32  |   })
  33  | 
  34  |   await test.step('Assert Accountant', async () => {
  35  |     await page
  36  |       .getByTestId('accountant')
  37  |       .getByRole('button', { name: 'Accountant' })
  38  |       .click()
  39  |     await expect(
  40  |       page.getByTestId('accountant').getByRole('code').getByText('Miranda')
  41  |     ).not.toBeVisible()
  42  |     await expect(page.getByRole('code').getByText('1337')).not.toBeVisible()
  43  |     await page
  44  |       .getByTestId('accountant')
  45  |       .getByRole('button', { name: 'Accountant' })
  46  |       .click()
  47  |     await expect(
  48  |       page.getByTestId('accountant').getByRole('code').getByText('Miranda')
  49  |     ).toBeVisible()
  50  |     await expect(page.getByRole('code').getByText('1337')).toBeVisible()
  51  |   })
  52  | 
  53  |   await test.step('Add assistant', async () => {
  54  |     await page
  55  |       .getByTestId('assistant')
  56  |       .getByRole('button', { name: 'Select Entity' })
  57  |       .click()
  58  |     await selectJohn()
  59  |     await page
  60  |       .getByTestId('assistant')
  61  |       .getByRole('button', { name: 'Open' })
  62  |       .click()
  63  |     await expect(page.getByRole('code').getByText('John')).toBeVisible()
  64  |     await expect(page.getByRole('code').getByText('1234')).toBeVisible()
  65  |     await page.getByRole('button', { name: 'Close assistant' }).click()
  66  |   })
  67  | 
  68  |   await test.step('Add trainee', async () => {
  69  |     await page
  70  |       .getByTestId('trainee')
  71  |       .getByRole('button', { name: 'Select Entity' })
  72  |       .click()
  73  |     await selectJohn()
  74  |     await expect(
  75  |       page.getByTestId('trainee').getByRole('code').getByText('John')
  76  |     ).toBeVisible()
  77  |     await expect(
  78  |       page.getByTestId('trainee').getByRole('code').getByText('1234')
  79  |     ).toBeVisible()
  80  |   })
  81  | 
  82  |   await test.step('Change accountant', async () => {
  83  |     await page
  84  |       .getByTestId('accountant')
  85  |       .getByRole('button', { name: 'Select Entity' })
  86  |       .click()
  87  |     await selectJohn()
  88  |     await expect(
  89  |       page.getByTestId('accountant').getByRole('code').getByText('John')
  90  |     ).toBeVisible()
  91  |     await expect(
  92  |       page.getByTestId('accountant').getByRole('code').getByText('1234')
  93  |     ).toBeVisible()
  94  |   })
  95  | 
  96  |   await test.step('Remove trainee', async () => {
  97  |     const trainee = page.getByTestId('trainee')
  98  |     await trainee.getByRole('button', { name: 'Delete permanently' }).click()
  99  |     await page.getByLabel('Confirm Delete').click()
  100 |     await expect(trainee.getByRole('code').getByText('John')).not.toBeVisible()
  101 |     await expect(trainee.getByRole('code').getByText('1234')).not.toBeVisible()
  102 |   })
  103 | 
  104 |   await test.step('Submit form', async () => {
```