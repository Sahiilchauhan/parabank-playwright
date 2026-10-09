# Architectural Decisions

## 1. State contention
ParaBank is a shared public sandbox, so the framework avoids collisions in two ways.

**Unique data per run.** Every user is generated with a timestamp plus a random digit, so two engineers running the suite at the same time never register the same username. Usernames are kept to 18 characters or fewer, because the sandbox rejects longer ones and reports them as "username already exists", which looks like a collision but is not.

**Global state is the real risk.** The admin `cleanDB` call wipes the whole database for everyone. It runs only at the start of Scenario A, never between tests, and Scenario C does not call it at all, so C cannot break another engineer's run. The remaining risk is that one engineer's cleanDB can still wipe the data another engineer's Scenario A or B is using. This cannot be fully removed on a shared sandbox. The mitigations are:
- Run the suite serially (`--workers=1`) on a single CI worker.
- Serialize CI jobs that target the public sandbox, or point the suite at a private ParaBank instance by changing the base URL.

## 2. Currency handling
Floating-point sums such as 150 + 25.5 + 8.99 can produce values like 184.48999999999998. Amounts from the transactions table are parsed from strings such as "$25.50": the currency symbol and thousands separators are removed, and the value is converted to integer cents. All sums and comparisons are done on integer cents. Values are divided by 100 only for display. The final assertion compares the cents total against the change in the origin account balance, which is also parsed to cents. See `utils/currency.ts`.

## 3. API vs UI boundary
API calls are used for setup and for anything that is not the behavior under test: resetting the database, setting the loan provider, and all of Scenario C. The UI is used where the scenario validates what a user sees and does: registration, opening an account, applying for a loan, transferring funds, and reading the transaction table. Page objects hold the locators and actions, and tests hold the assertions. Waits are always tied to a condition (an element or option appearing), never a fixed sleep.

## Known limitations
- Scenario B depends on the user data written by Scenario A (`shared-data/scenarioA.json`), so it must run after A with one worker.
- Scenario C creates its user by posting the registration form over HTTP, because ParaBank's REST API has no endpoint to create a customer. Everything after registration (login, accounts, deposit, transactions) uses the REST API.