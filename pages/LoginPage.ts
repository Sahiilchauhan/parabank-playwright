import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly accountsOverviewTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("//input[@name='username']");
    this.password = page.locator("//input[@name='password']");
    this.loginButton = page.locator("//input[@value='Log In']");
    this.accountsOverviewTitle = page.locator("//h1[normalize-space()='Accounts Overview']");
  }

  async goto() {
    await this.page.goto('https://parabank.parasoft.com/parabank/index.htm');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();

    
    await expect(this.accountsOverviewTitle).toBeVisible();
  }
}