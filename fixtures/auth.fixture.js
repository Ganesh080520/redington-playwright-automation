const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { requiredEnv } = require('../utils/env');

const test = base.test.extend({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLogin();
    await loginPage.login(requiredEnv('TEST_EMAIL'), requiredEnv('TEST_PASSWORD'));
    await use(page);
  }
});

module.exports = { test, expect: base.expect };
