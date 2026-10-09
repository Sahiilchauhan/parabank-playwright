import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipCode: Locator;
  readonly phone: Locator;
  readonly ssn: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[id="customer.firstName"]');
    this.lastName = page.locator('[id="customer.lastName"]');
    this.street = page.locator('[id="customer.address.street"]');
    this.city = page.locator('[id="customer.address.city"]');
    this.state = page.locator('[id="customer.address.state"]');
    this.zipCode = page.locator('[id="customer.address.zipCode"]');
    this.phone = page.locator('[id="customer.phoneNumber"]');
    this.ssn = page.locator('[id="customer.ssn"]');
    this.username = page.locator('[id="customer.username"]');
    this.password = page.locator('[id="customer.password"]');
    this.confirmPassword = page.locator('#repeatedPassword');
    this.registerButton = page.locator("//input[@value='Register']");
  }

  async goto() {
    await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
  }

  async register(user: {
    firstName: string; lastName: string; street: string; city: string;
    state: string; zipCode: string; phone: string; ssn: string;
    username: string; password: string;
  }) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.street.fill(user.street);
    await this.city.fill(user.city);
    await this.state.fill(user.state);
    await this.zipCode.fill(user.zipCode);
    await this.phone.fill(user.phone);
    await this.ssn.fill(user.ssn);
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.registerButton.click();
  }
}