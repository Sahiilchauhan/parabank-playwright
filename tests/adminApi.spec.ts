import { test, expect } from '@playwright/test';
import { cleanDatabase, setLoanProvider } from '../api/adminApi';

test('admin API: clean DB and set loan provider', async ({ request, page }) => {
  await cleanDatabase(request);
  await setLoanProvider(request, 'ws');

  // Verify - admin page setting changed
  await page.goto('https://parabank.parasoft.com/parabank/admin.htm');
  await expect(page.locator('#loanProvider')).toHaveValue('ws');
});