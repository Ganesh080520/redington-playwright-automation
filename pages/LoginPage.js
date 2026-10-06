const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).first();
    this.passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first();
    this.loginButton = page.getByRole('button', { name: /log in|login|sign in/i }).first();
    this.logoutButton = page.getByRole('button', { name: /log out/i });
  }

  async openLogin() {
    await this.open('/login');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 40000 }),
      this.loginButton.click()
    ]);
    await this.waitForPageReady();
  }

  async loginWithEnter(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
    await this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 40000 });
    await this.waitForPageReady();
  }

  async verifyLoggedIn(email) {
    await expect(this.page.getByText(email, { exact: true })).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async verifySessionPersistsAfterRefresh(email) {
    const urlBeforeRefresh = this.page.url();
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForPageReady();
    await expect(this.page).not.toHaveURL(/\/login/);
    await expect(this.page.getByText(email, { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(this.logoutButton).toBeVisible();
    expect(new URL(this.page.url()).pathname).toBe(new URL(urlBeforeRefresh).pathname);
    console.log('Authenticated session persisted after refresh.');
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 30000 });
  }
}

module.exports = { LoginPage };
