const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class BrandCreationPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('New Brand', { exact: true }).first();
    this.stepOneIndicator = page.getByText(/Step 1 of 3.*Brand Sources/i);
    this.brandNameInput = page.getByPlaceholder('e.g. Cisco Systems', { exact: true });
    this.websiteUrlInput = page.locator('input[placeholder*="brandname.com"]').first();
    this.brandPortfolioInput = page.getByRole('combobox', { name: /Brand Portfolio/i });
    this.productPortfolioInput = page.getByPlaceholder('e.g. Networking', { exact: true });
    this.taglineInput = page.getByPlaceholder('e.g. The bridge to possible', { exact: true });
    this.assetBrandInput = page.getByRole('combobox', { name: /Asset brand/i });
    this.fontNameInput = page.getByPlaceholder(/Inter, Serif, Helvetica Neue/i);
    this.addFontButton = page.getByRole('button', { name: /add font/i });
    this.objectivesInput = page.getByPlaceholder('Select up to 5 objectives...');
    this.productNameInputs = page.getByPlaceholder('e.g. Product name');
    this.productUrlInputs = page.getByPlaceholder('e.g. https://...');
    this.addUrlButtons = page.getByRole('button', { name: /add URL/i });
    this.addProductButton = page.getByRole('button', { name: /add product/i });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.analyzeButton = page.getByRole('button', { name: /Analyze brand with AI/i });
  }

  async openCreateBrand() {
    console.log('Opening Create Brand page...');
    await this.page.goto('/create-brand', { waitUntil: 'domcontentloaded' });
    const loaded = await this.brandNameInput.waitFor({ state: 'visible', timeout: 15000 })
      .then(() => true).catch(() => false);
    if (!loaded) {
      const menu = this.page.getByText('Create Brand', { exact: true }).first();
      await expect(menu).toBeVisible({ timeout: 15000 });
      await menu.click();
      await this.page.waitForURL(url => url.pathname.includes('/create-brand'), { timeout: 30000 });
    }
    await expect(this.heading).toBeVisible({ timeout: 30000 });
    await expect(this.stepOneIndicator).toBeVisible();
    await expect(this.brandNameInput).toBeVisible();
    await expect(this.websiteUrlInput).toBeVisible();
    await expect(this.brandPortfolioInput).toBeVisible();
    await expect(this.productPortfolioInput).toBeVisible();
    await expect(this.assetBrandInput).toBeVisible();
    await expect(this.analyzeButton).toBeVisible();
    console.log('Create Brand form loaded successfully.');
  }

  async selectBrandDropdown(combobox, optionName) {
    if (!optionName?.trim()) throw new Error('A dropdown option name is required.');
    const value = optionName.trim();
    await this.scrollTo(combobox);
    await expect(combobox).toBeVisible();
    if ((await combobox.inputValue()).trim().toLowerCase() === value.toLowerCase()) return;
    await combobox.click();
    const option = this.page.getByRole('option', { name: value, exact: true });
    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
    await expect(combobox).toHaveValue(value);
  }

  async enterBasicDetails(data) {
    await this.brandNameInput.fill(data.brandName);
    await this.websiteUrlInput.fill(data.websiteUrl);
    await this.selectBrandDropdown(this.brandPortfolioInput, data.brandPortfolio);
    await this.productPortfolioInput.fill(data.productPortfolio);
    if (data.tagline) await this.taglineInput.fill(data.tagline);
    await this.selectBrandDropdown(this.assetBrandInput, data.assetBrand);
    await this.selectSegment(data.segment);
  }

  async verifyBasicDetails(data) {
    await expect(this.brandNameInput).toHaveValue(data.brandName);
    await expect(this.websiteUrlInput).toHaveValue(data.websiteUrl);
    await expect(this.brandPortfolioInput).toHaveValue(data.brandPortfolio);
    await expect(this.productPortfolioInput).toHaveValue(data.productPortfolio);
    if (data.tagline) await expect(this.taglineInput).toHaveValue(data.tagline);
    await expect(this.assetBrandInput).toHaveValue(data.assetBrand);
  }

  async selectSegment(segment) {
    if (!segment?.trim()) throw new Error('A segment value is required.');
    const button = this.page.getByRole('button', { name: segment.trim(), exact: true });
    await this.scrollTo(button);
    await expect(button).toBeEnabled();
    await button.click();
  }

  async uploadGuidelines(paths) { await this.uploadFromSection('Upload guidelines', paths); }
  async uploadAdditionalDocuments(paths) { await this.uploadFromSection('Upload additional documents', paths); }

  async uploadLogo(kind, path) {
    if (!['Primary logo', 'Light logo', 'Dark logo'].includes(kind)) {
      throw new Error(`Unsupported logo kind: ${kind}`);
    }
    await this.uploadFromSection(kind, path);
  }

  async addFont(name, path = null) {
    await this.scrollTo(this.fontNameInput);
    await this.fontNameInput.fill(name);
    if (path) await this.uploadFromSection('Upload font files', path);
    if (await this.addFontButton.isVisible().catch(() => false)) await this.addFontButton.click();
  }

  async selectObjectives(objectives) {
    for (const objective of objectives) {
      await this.objectivesInput.click();
      const option = this.page.getByRole('option', { name: objective, exact: true });
      await expect(option).toBeVisible();
      await option.click();
    }
  }

  async uploadTemplate(paths) { await this.uploadFromSection('Upload templates', paths); }

  async fillProduct(index, data) {
    const name = this.productNameInputs.nth(index);
    await name.fill(data.name);
    await this.productUrlInputs.nth(index).fill(data.url);
    if (data.additionalUrls) {
      for (const url of data.additionalUrls) {
        const count = await this.productUrlInputs.count();
        await this.addUrlButtons.nth(index).click();
        await this.productUrlInputs.nth(count).fill(url);
      }
    }
  }

  async addAnotherProduct() { await this.addProductButton.click(); }

  async cancelDraft() {
    await this.brandNameInput.fill(`Unsaved Draft ${Date.now()}`);
    await expect(this.cancelButton).toBeVisible();
    await this.cancelButton.click();
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      const discard = dialog.getByRole('button', { name: /discard|leave|confirm|yes/i }).first();
      if (await discard.isVisible().catch(() => false)) await discard.click();
    }
    await expect(this.page).not.toHaveURL(/\/create-brand(?:\?|$)/, { timeout: 30000 });
    console.log('Cancel safely left the unsaved brand draft.');
  }

  async analyzeBrand() {
    await this.scrollTo(this.analyzeButton);
    await expect(this.analyzeButton).toBeEnabled({ timeout: 30000 });
    await this.analyzeButton.click();
    await expect(this.page.getByText(/Step 2 of 3/i)).toBeVisible({ timeout: 120000 });
    await expect(this.analyzeButton).toBeHidden({ timeout: 30000 });
  }
}

module.exports = { BrandCreationPage };