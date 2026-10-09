import { Page, Locator, expect } from '@playwright/test';

export class TransferFundsPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly amount: Locator;
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly transferButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.locator("//a[text()='Transfer Funds']");
    this.amount = page.locator('#amount');
    this.fromAccount = page.locator('#fromAccountId');
    this.toAccount = page.locator('#toAccountId');
    this.transferButton = page.locator("//input[@value='Transfer']");
    this.result = page.locator('#showResult');
  }

  async transfer(amount: string, fromId: string, toId: string) {
    await this.menuLink.click();

    // No sleep: wait until both accounts appear in the dropdowns
    await expect(this.fromAccount.locator(`option[value="${fromId}"]`)).toHaveCount(1);
    await expect(this.toAccount.locator(`option[value="${toId}"]`)).toHaveCount(1);

    await this.amount.fill(amount);
    await this.fromAccount.selectOption(fromId);
    await this.toAccount.selectOption(toId);
    await this.transferButton.click();

    await expect(this.result).toContainText('Transfer Complete');
  }
}