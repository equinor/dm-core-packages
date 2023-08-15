# How to run Playwright tests

1. Make sure the example web application is running on localhost:3000 (see example/README.md for how to start it). It
   might be necessary to reset the database.
2. Install playwright:

```
npm install @playwright/test
npx playwright install
```

3. In the terminal, navigate to the e2e folder and run the tests. You can run tests in several ways, this is explained in the [official Playwright documentation](https://playwright.dev/docs/running-tests). Most common ways include:

Run all test in headless mode:

```
npx playwright test
```

To run in headed mode you need to add a flag:

```
npx playwright test --headed
```

Running a single test file:

```
npx playwright test signalApp.spec.ts
```

Run tests using [UI mode](https://playwright.dev/docs/test-ui-mode) (useful for debugging):

```
npx playwright test --ui
```

Start [code generator](https://playwright.dev/docs/codegen-intro) (useful for quickly generating basic testcode):

```
npx playwright codegen localhost:3000
```

## VS Code Plugin

If you are using VS Code then the official [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) from Microsoft is very useful.
