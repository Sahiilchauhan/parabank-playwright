import { Page, Locator, expect } from '@playwright/test';

export class AccountsOverviewPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly accountsTable: Locator;
  readonly firstAccountLink: Locator;



  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.locator("//a[text()='Accounts Overview']");
    this.accountsTable = page.locator('#accountTable');
    this.firstAccountLink = page.locator("//table[@id='accountTable']//tbody/tr[1]/td[1]/a");
  }



  async open() {
    await this.menuLink.click();
    
    await expect(this.accountsTable).toBeVisible();
  }


  async getFirstAccountId(): Promise<string> {
    await expect(this.firstAccountLink).toBeVisible();
    return (await this.firstAccountLink.innerText()).trim();
  }



  async getBalance(accountId: string): Promise<string> {
    const row = this.page.locator(`//a[text()='${accountId}']/ancestor::tr`);
 
    await expect(row).toBeVisible();
    return (await row.locator('td').nth(1).innerText()).trim();
  }
}