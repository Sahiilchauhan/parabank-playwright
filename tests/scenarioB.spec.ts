import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';
import { toCents, sumCents, formatCents } from '../utils/currency';
import { loadSharedData } from '../utils/sharedData';

test('Scenario B: transfers and currency parsing', async ({ page }) => {
  // same user that Scenario A created
  const data = loadSharedData();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(data.username, data.password);
  console.log('Logged in as: ' + data.username);

  // origin account = first account, balance before the transfers
  const overviewPage = new AccountsOverviewPage(page);
  await overviewPage.open();
  const originId = await overviewPage.getFirstAccountId();
  const startBalance = toCents(await overviewPage.getBalance(originId));
  console.log('Origin account: ' + originId + ', start balance: ' + formatCents(startBalance));

  // debits that already exist from Scenario A
  const findPage = new FindTransactionsPage(page);
  await findPage.findAllTransactions(originId);
  const debitsBefore = sumCents(await findPage.getDebitValues());

  // 1. three transfers of different amounts, into the checking account from A
  const transferPage = new TransferFundsPage(page);
  await transferPage.transfer('150', originId, data.checkingId);
  await transferPage.transfer('25.50', originId, data.checkingId);
  await transferPage.transfer('8.99', originId, data.checkingId);

  // 2 and 3. find transactions and read the debit column
  await findPage.findAllTransactions(originId);
  const debitValues = await findPage.getDebitValues();
  console.log('Debit values from table: ' + debitValues.join(' | '));

  // 4. validation, all math in cents
  const totalOut = sumCents(debitValues) - debitsBefore;
  await overviewPage.open();
  const endBalance = toCents(await overviewPage.getBalance(originId));
  console.log('Total transferred out: ' + formatCents(totalOut));
  console.log('End balance: ' + formatCents(endBalance));

  expect(totalOut).toBe(15000 + 2550 + 899);
  expect(startBalance - endBalance).toBe(totalOut);
});