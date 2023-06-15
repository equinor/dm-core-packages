# How to run tests

1) Make sure the example web application is running on localhost:3000 (see example/README.md for how to start it). It
   might be necessary to reset the database.
2) Install playwright:

```
npm install @playwright/test
npx playwright install
```

3) In the terminal, navigate to the e2e folder and run

```
npx playwright test
```

