import { test, expect } from '@playwright/test';
import { cleanDatabase, setLoanProvider } from '../api/adminApi';
import { RegisterPage } from '../pages/RegisterPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { RequestLoanPage } from '../pages/RequestLoanPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { generateUser } from '../types/dataGenerator';
import { saveSharedData } from '../utils/sharedData';

test('Scenario A: loan orchestration', async ({ page, request }) => {
  // 1. API pre-condition
  await cleanDatabase(request);
  await setLoanProvider(request, 'ws');

  // 2. UI action: register a new user
  const user = generateUser();
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.register(user);
  await expect(page.locator("//p[contains(text(),'Your account was created successfully')]")).toBeVisible();
  console.log('User registered: ' + user.username);

  // open a new checking account and get its dynamic id
  const openAccountPage = new OpenAccountPage(page);
  const checkingId = await openAccountPage.openCheckingAccount();
  console.log('Checking account opened: ' + checkingId);

  // save the user so Scenario B can use the same one
  saveSharedData({
    username: user.username,
    password: user.password,
    checkingId: checkingId,
  });

  // apply for a loan using that account id
  const loanPage = new RequestLoanPage(page);
  await loanPage.applyForLoan('1000', '100', checkingId);

  // 3. Validation
  const status = await loanPage.getLoanStatus();
  expect(status).toBe('Approved');
  console.log('Loan status: ' + status);

  const loanAccountId = await loanPage.getLoanAccountId();
  console.log('New loan account number: ' + loanAccountId);

  const overviewPage = new AccountsOverviewPage(page);
  await overviewPage.open();
  const balance = await overviewPage.getBalance(loanAccountId);
  expect(balance).toBe('$1000.00');
  console.log('Loan account balance: ' + balance);
});