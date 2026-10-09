import { Page, Locator, expect } from '@playwright/test';

export class RequestLoanPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly loanAmount: Locator;
  readonly downPayment: Locator;
  readonly fromAccount: Locator;
  readonly applyButton: Locator;
  readonly loanStatus: Locator;
  readonly loanAccountId: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.locator("//a[text()='Request Loan']");
    this.loanAmount = page.locator('#amount');
    this.downPayment = page.locator('#downPayment');
    this.fromAccount = page.locator('#fromAccountId');
    this.applyButton = page.locator("//input[@value='Apply Now']");
    this.loanStatus = page.locator('#loanStatus');
    this.loanAccountId = page.locator('#newAccountId');
  }

  async applyForLoan(amount: string, downPayment: string, fromAccountId: string) {
    await this.menuLink.click();

    
    await expect(this.fromAccount.locator('option')).not.toHaveCount(0);
    await expect(
      this.fromAccount.locator(`option[value="${fromAccountId}"]`)
    ).toHaveCount(1);

    await this.loanAmount.fill(amount);
    await this.downPayment.fill(downPayment);
    await this.fromAccount.selectOption(fromAccountId);
    await this.applyButton.click();
  }

  async getLoanStatus(): Promise<string> {
    await expect(this.loanStatus).toBeVisible();
    return (await this.loanStatus.innerText()).trim();
  }

  async getLoanAccountId(): Promise<string> {
    return (await this.loanAccountId.innerText()).trim();
  }
}