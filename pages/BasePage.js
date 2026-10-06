const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async open(path) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageReady();
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    const loaders = this.page.locator(
      '[role="progressbar"], .mantine-Loader-root, [data-loading="true"]'
    );
    await loaders.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async scrollTo(locator) {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
  }

  async selectMantineOption(combobox, optionName) {
    await this.scrollTo(combobox);
    await combobox.click();
    const option = this.page.getByRole('option', {
      name: optionName,
      exact: true
    });
    await expect(option).toBeVisible();
    await option.click();
  }

  async uploadFromSection(sectionText, filePaths) {
    const sectionButton = this.page.locator('button').filter({
      hasText: sectionText
    }).first();
    await this.scrollTo(sectionButton);
    const input = sectionButton.locator(
      'xpath=following-sibling::input[@type="file"][1]'
    );
    await expect(input).toBeAttached();
    await input.setInputFiles(filePaths);
  }
}

module.exports = { BasePage };
