import { test, expect } from '@playwright/test';

test('Open ParaBank', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/');
  await expect(page).toHaveTitle(/ParaBank/);
  
});