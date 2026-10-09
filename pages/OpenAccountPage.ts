import { Page, Locator, expect } from '@playwright/test';

export class OpenAccountPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly accountType: Locator;
  readonly fromAccount: Locator;
  readonly openButton: Locator;
  readonly successMessage: Locator;
  readonly newAccountId: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.locator("//a[text()='Open New Account']");
    this.accountType = page.locator('#type');
    this.fromAccount = page.locator('#fromAccountId');
    this.openButton = page.locator("//input[@value='Open New Account']");
    this.successMessage = page.locator("//p[contains(text(),'Congratulations')]");
    this.newAccountId = page.locator('#newAccountId');
  }

  async openCheckingAccount(): Promise<string> {
    await this.menuLink.click();

   
    await expect(this.fromAccount.locator('option')).not.toHaveCount(0);

    await this.accountType.selectOption({ label: 'CHECKING' });
    await this.openButton.click();

    await expect(this.successMessage).toBeVisible();
    return (await this.newAccountId.innerText()).trim();
  }
}