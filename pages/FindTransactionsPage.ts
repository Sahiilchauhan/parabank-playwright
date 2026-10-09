import { Page, Locator, expect } from '@playwright/test';

export class FindTransactionsPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly accountDropdown: Locator;
  readonly fromDate: Locator;
  readonly toDate: Locator;
  readonly findByDateRangeButton: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.locator("//a[text()='Find Transactions']");
    this.accountDropdown = page.locator('#accountId');
    this.fromDate = page.locator('#fromDate');
    this.toDate = page.locator('#toDate');
    this.findByDateRangeButton = page.locator('#findByDateRange');
    this.tableRows = page.locator('#transactionBody tr');
  }

  async findAllTransactions(accountId: string) {
    await this.menuLink.click();

    // No sleep: wait until our account appears in the dropdown
    await expect(this.accountDropdown.locator(`option[value="${accountId}"]`)).toHaveCount(1);
    await this.accountDropdown.selectOption(accountId);

    // wide date range so we do not depend on today's date or time zone
    await this.fromDate.fill('01-01-2020');
    await this.toDate.fill('12-31-2030');
    await this.findByDateRangeButton.click();

    // No sleep: wait until the table has at least one row
    await expect(this.tableRows.first()).toBeVisible();
  }

  // returns the Debit column text of every row, like "$150.00" (empty if no debit)
  async getDebitValues(): Promise<string[]> {
    const count = await this.tableRows.count();
    const debits: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.tableRows.nth(i).locator('td').nth(2).innerText();
      debits.push(text.trim());
    }
    return debits;
  }
}