# ParaBank Playwright Framework

Test automation framework for https://parabank.parasoft.com built with Playwright and TypeScript. It uses the Page Object Model, API-level setup, and a custom glassmorphism HTML reporter (accent color `#F48031`).

## Prerequisites
- Node.js 18 or newer
- Git

## Install
```bash
npm install
npx playwright install chromium
```

## Run the full suite (headless)
```bash
npx playwright test --project=chromium --workers=1
```
`--workers=1` is required. Scenario B reuses the user created by Scenario A through `shared-data/scenarioA.json`, so the scenarios must run in order.

## Run a single scenario
```bash
npx playwright test tests/scenarioA.spec.ts --project=chromium --workers=1
npx playwright test tests/scenarioB.spec.ts --project=chromium --workers=1
npx playwright test tests/scenarioC.spec.ts --project=chromium --workers=1
```
Scenario B needs Scenario A to have run first. Scenario C is fully independent.

## Run with a visible browser
```bash
npx playwright test --project=chromium --workers=1 --headed
```

## Generate and view the custom report
The custom reporter runs automatically with every test run and writes `reports/summary.html`. Open it:

```bash
# Windows
start reports\summary.html

# macOS
open reports/summary.html

# Linux
xdg-open reports/summary.html
```

## Project structure
```
api/           Admin API helpers (clean DB, set loan provider)
pages/         Page objects (one class per page)
reporters/     Custom glassmorphism reporter
shared-data/   Data passed from Scenario A to Scenario B
tests/         Scenario A, B, C and supporting specs
types/         API types and zod schemas
utils/         Currency parsing, data generation, shared-data helpers
```

## Scenarios
- **A:** Clean DB and set loan provider via API, register a user, open a checking account, apply for a loan, verify the loan account and its balance.
- **B:** Three transfers, parse the Find Transactions table, and assert the sum matches the balance change.
- **C:** Headless API test: create a user, deposit, fetch transactions, and validate the response against a zod schema.

See `DECISIONS.md` for design decisions.