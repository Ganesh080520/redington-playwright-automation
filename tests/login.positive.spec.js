const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { requiredEnv } = require('../utils/env');

test.describe('Redington Login — Positive Cases', () => {
  test('LGN-P-001: login page loads', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLogin();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('LGN-P-002: Brand User logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = requiredEnv('TEST_EMAIL');
    await loginPage.openLogin();
    await loginPage.login(email, requiredEnv('TEST_PASSWORD'));
    await loginPage.verifyLoggedIn(email);
  });

  test('LGN-P-003: user can submit login using Enter', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLogin();
    await loginPage.loginWithEnter(requiredEnv('TEST_EMAIL'), requiredEnv('TEST_PASSWORD'));
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('LGN-P-004: password is masked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLogin();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('LGN-P-008: authenticated user can log out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLogin();
    await loginPage.login(requiredEnv('TEST_EMAIL'), requiredEnv('TEST_PASSWORD'));
    await loginPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  test('LGN-P-010: session persists during page refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = requiredEnv('TEST_EMAIL');
    await loginPage.openLogin();
    await loginPage.login(email, requiredEnv('TEST_PASSWORD'));
    await loginPage.verifySessionPersistsAfterRefresh(email);
  });
});