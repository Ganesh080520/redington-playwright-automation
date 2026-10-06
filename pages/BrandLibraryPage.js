const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class BrandLibraryPage extends BasePage {
  constructor(page) {
    super(page);
    this.brandLabHeading = page.getByText('Brand Lab',{ exact: true }).last();
/*
 * Compatibility alias so existing tests using
 * libraryHeading do not need to be rewritten.
 */
    this.libraryHeading =this.brandLabHeading;
    this.aiProfileHeading = page.getByText('AI brand profile', { exact: true });
    this.stepTwoIndicator = page.getByText(/Step 2 of 3.*AI Brand Profile/i);
    this.analysisCompleteMessage = page.getByText(/AI analysis complete/i);
    this.audienceSectionTitle = page.getByText('Audience & positioning', { exact: true }).first();
    this.contentPreferencesTitle = page.getByText('Content preferences', { exact: true }).first();
    this.voiceMessagingTitle = page.getByText(/Voice, style & messaging|Voice & messaging/i, { exact: true }).first();
    this.continueToReviewButton = page.getByRole('button', { name: /Continue to Review/i });
    this.reviewHeading = page.getByText('Review & save', { exact: true });
    this.stepThreeIndicator = page.getByText(/Step 3 of 3.*Review & Launch/i);
    this.readyToLaunchText = page.getByText('Ready to launch', { exact: true });
    this.brandReadinessTitle = page.getByText('Brand readiness', { exact: true });
    this.readinessPercentage = page.getByText(/^\d+%\s+complete$/i);
    this.uploadedAssetsTitle = page.getByText('Uploaded assets', { exact: true });
    this.needsAttentionTitle = page.getByText('Needs attention', { exact: true });
    this.brandIdentityTitle = page.getByText('Brand identity', { exact: true });
    this.reviewAudienceTitle = page.getByText('Audience & positioning', { exact: true }).last();
    this.reviewContentPreferencesTitle = page.getByText('Content preferences', { exact: true }).last();
    this.sourcesAssetsTitle = page.getByText('Sources & assets', { exact: true });
    this.saveBrandButton = page.getByRole('button', { name: /Save brand/i });
    this.addProductDialog = page.getByRole('dialog');
    this.productNameInput = this.addProductDialog.getByLabel(/Product name/i);
    this.productUrlInputs = this.addProductDialog.locator('input[placeholder="https://..."]');
    this.productUrlInput = this.productUrlInputs.first();
    this.addAnotherUrlButton = this.addProductDialog.getByText('+ add URL', { exact: true });
    this.submitProductButton = this.addProductDialog.getByRole('button', { name: 'Add product', exact: true });
    this.cancelProductButton = this.addProductDialog.getByRole('button', { name: 'Cancel', exact: true });
    this.yourBrandsTitle =
      page.getByText(
        'Your brands',
        { exact: true }
      ).first();

    this.createBrandButton =
      page.getByRole(
        'button',
        {
          name: 'Create Brand',
          exact: true
        }
      );

    this.newCreativeBriefButton =
      page.getByRole(
        'button',
        {
          name: /New creative brief/i
        }
      );

    this.referenceLibraryButton =
      page.getByRole(
        'button',
        {
          name: 'Reference Library',
          exact: true
        }
      );

    this.brandAssetsButton =
      page.getByRole(
        'button',
        {
          name: 'Brand Assets',
          exact: true
    });
      }

  // ==========================================
// OPEN BRAND LAB
// ==========================================

async openBrandLibrary() {
  console.log('Opening Brand Lab...');
  await this.open('/brand-lab');
  await expect(this.brandLabHeading).toBeVisible({timeout: 30000});
  await expect(this.yourBrandsTitle).toBeVisible({timeout: 30000});
  console.log('Brand Lab loaded successfully.');
}

// ==========================================
// FIND BRAND CARD
// ==========================================

getBrandCard(brandName) {
  if (
    !brandName ||
    !brandName.trim()
  ) {
    throw new Error(
      'A brand name is required.'
    );
  }

  const requiredBrandName =brandName.trim();
  const brandNameElement =this.page.getByText(requiredBrandName,{exact: true}).first();

  return brandNameElement.locator(
    'xpath=ancestor::div[' +
    './/button[normalize-space()="Edit"] and ' +
    './/button[normalize-space()="Add product"]' +
    '][1]'
  );
}

async openExistingBrand(brandName) {
    if (
      !brandName ||
      !brandName.trim()
    ) {
      throw new Error(
        'EXISTING_BRAND_NAME must be configured.'
      );
    }

    const requiredBrandName =brandName.trim();
    console.log(
      `Locating existing brand in Brand Lab: ` +
      `${requiredBrandName}`
    );

    const brandNameElements =this.page.getByText(requiredBrandName,{exact: true});
    await expect(brandNameElements.first()).toBeVisible({timeout: 30000});
    const matchingCount =await brandNameElements.count();

    console.log(
      `Matching brand records found: ` +
      `${matchingCount}`
    );

    if (matchingCount > 1) {
      console.log(
        'Multiple brands have the same name. ' +
        'The first matching brand card will be used.'
      );
    }
    const brandCard =this.getBrandCard(requiredBrandName);
    await expect(brandCard).toBeVisible({timeout: 15000});
    const editButton =brandCard.getByRole('button',{name: 'Edit',exact: true});
    await expect(editButton).toBeVisible();
    await expect(editButton).toBeEnabled();
    await editButton.click();
    await this.page.waitForURL(url =>/\/create-brand\/[^/]+/.test(url.pathname),{timeout: 30000});
    console.log(`Existing brand opened: ` +`${this.page.url()}`);
  }

  async verifyBrandLabPage() {
    await expect(this.brandLabHeading).toBeVisible();
    await expect(this.yourBrandsTitle).toBeVisible();
    await expect(this.createBrandButton).toBeVisible();
    await expect(this.newCreativeBriefButton).toBeVisible();
    await expect(this.referenceLibraryButton).toBeVisible();
    await expect(this.brandAssetsButton).toBeVisible();
    console.log('Brand Lab controls verified successfully.');
  }

  // async openExistingBrand(brandName) {
  //   if (!brandName?.trim()) throw new Error('EXISTING_BRAND_NAME must be configured.');
  //   const card = this.getBrandCard(brandName.trim());
  //   await expect(card).toBeVisible({ timeout: 30000 });
  //   await card.getByRole('button', { name: 'Edit', exact: true }).click();
  //   await this.page.waitForURL(url => /\/create-brand\/[^/]+/.test(url.pathname), { timeout: 30000 });
  // }

  async verifyAiBrandProfile() {
    await expect(this.aiProfileHeading).toBeVisible({ timeout: 30000 });
    await expect(this.stepTwoIndicator).toBeVisible();
    await expect(this.analysisCompleteMessage).toBeVisible();
  }

  async ensureSectionExpanded(title, control) {
    await title.scrollIntoViewIfNeeded();
    if (await control.isVisible().catch(() => false)) return;
    const header = title.locator('xpath=ancestor::*[self::button or @role="button" or .//*[name()="svg"]][1]');
    if (await header.isVisible().catch(() => false)) await header.click(); else await title.click();
    await expect(control).toBeVisible({ timeout: 15000 });
  }

  async selectTargetPersonas(personas) {
    if (!personas?.length) throw new Error('At least one target persona must be configured.');
    const first = this.page.getByRole('checkbox', { name: personas[0], exact: true });
    await this.ensureSectionExpanded(this.audienceSectionTitle, first);
    for (const persona of personas) {
      const checkbox = this.page.getByRole('checkbox', { name: persona, exact: true });
      if (!(await checkbox.isChecked())) await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
  }

  async selectContentPreferences(preferences) {
    if (!preferences?.length) throw new Error('At least one content preference must be configured.');
    const first = this.page.getByRole('checkbox', { name: preferences[0], exact: true });
    await this.ensureSectionExpanded(this.contentPreferencesTitle, first);
    for (const preference of preferences) {
      const checkbox = this.page.getByRole('checkbox', { name: preference, exact: true });
      if (!(await checkbox.isChecked())) await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
  }

  async verifyVoiceMessagingContent() {
    const toneWords = this.page.getByText('Tone words', { exact: true });
    await this.ensureSectionExpanded(this.voiceMessagingTitle, toneWords);
    await expect(toneWords).toBeVisible();
    const toneContainer = toneWords.locator('xpath=following::*[self::div or self::section][1]');
    await expect.poll(async () => (await toneContainer.innerText()).trim().length).toBeGreaterThan(0);
    const pillars = this.page.getByText(/Core messaging pillars|Messaging pillars/i).first();
    await expect(pillars).toBeVisible();
    const populatedFields = await this.page.locator('input, textarea').evaluateAll(
      elements => elements.filter(element => element.value?.trim()).length
    );
    expect(populatedFields).toBeGreaterThan(0);
    console.log('BPR-P-006: tone words and messaging pillars are populated.');
  }

  async verifyDosAndDonts() {
  const dosTitle = this.page.getByText(/^DO'?S$/i).first();
  const dontsTitle = this.page.getByText(/^DON'?TS$/i).first();
  await dosTitle.scrollIntoViewIfNeeded();
  await expect(dosTitle).toBeVisible({timeout: 15000});
  await expect(dontsTitle).toBeVisible({timeout: 15000});

  /*
   * Locate the closest panel containing editable
   * guidance fields. Input values are not included
   * in innerText(), so they must be read separately.
   */
  const doPanel = dosTitle.locator(
    'xpath=ancestor::div[' +
    './/input or ' +
    './/textarea or ' +
    './/*[@contenteditable="true"]' +
    '][1]'
  );

  const dontPanel = dontsTitle.locator(
    'xpath=ancestor::div[' +
    './/input or ' +
    './/textarea or ' +
    './/*[@contenteditable="true"]' +
    '][1]'
  );

  await expect(doPanel).toBeVisible();
  await expect(dontPanel).toBeVisible();
  const getGuidanceValues =
    async panel => {
      return panel
        .locator(
          'input, textarea, ' +
          '[contenteditable="true"]'
        )
        .evaluateAll(elements =>
          elements
            .map(element => {
              if (
                element instanceof
                HTMLInputElement ||
                element instanceof
                HTMLTextAreaElement
              ) {
                return element.value.trim();
              }

              return (
                element.textContent || ''
              ).trim();
            })
            .filter(value =>
              value.length > 0
            )
        );
};

  const doValues =await getGuidanceValues(doPanel);
  const dontValues =await getGuidanceValues(dontPanel);
  console.log(`Do guidance entries found: ` +`${doValues.length}`);
  console.log(`Don't guidance entries found: ` +`${dontValues.length}`);
  expect(doValues.length).toBeGreaterThan(0);
  expect(dontValues.length).toBeGreaterThan(0);
  for (
    const guidance of doValues
  ) {
    expect(guidance.length).toBeGreaterThan(5);
  }

  for (
    const guidance of dontValues
  ) {
    expect(guidance.length).toBeGreaterThan(5);
 }
  console.log("BPR-P-007: Do and Don't " +'guidance is populated.');
}

  async continueToReview() {
    await this.continueToReviewButton.scrollIntoViewIfNeeded();
    await expect(this.continueToReviewButton).toBeEnabled();
    await this.continueToReviewButton.click();
    await expect(this.reviewHeading).toBeVisible({ timeout: 30000 });
    await expect(this.stepThreeIndicator).toBeVisible();
  }

  async verifyReviewPage(brandName) {
    await expect(this.readyToLaunchText).toBeVisible();
    await expect(this.brandReadinessTitle).toBeVisible();
    const text = (await this.readinessPercentage.innerText()).trim();
    const percentage = Number(text.match(/\d+/)?.[0]);
    expect(percentage).toBeGreaterThan(0);
    expect(percentage).toBeLessThanOrEqual(100);
    await expect(this.page.getByText(brandName, { exact: true })).toBeVisible();
  }

  async verifyReviewSections() {
    for (const title of [this.brandIdentityTitle, this.voiceMessagingTitle, this.reviewAudienceTitle,
      this.reviewContentPreferencesTitle, this.sourcesAssetsTitle]) {
      await title.scrollIntoViewIfNeeded();
      await expect(title).toBeVisible();
    }
  }

  async verifyUploadedAssets() {
    await this.uploadedAssetsTitle.scrollIntoViewIfNeeded();
    await expect(this.uploadedAssetsTitle).toBeVisible();
    await expect(this.page.getByText('brand-guidelines.pdf', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Primary logo', { exact: true }).first()).toBeVisible();
  }

  async verifyOptionalWarnings() {
    if (await this.needsAttentionTitle.isVisible().catch(() => false)) {
      const warnings = this.page.getByText(/not uploaded|not added/i);
      expect(await warnings.count()).toBeGreaterThan(0);
    }
    await expect(this.readyToLaunchText).toBeVisible();
    await expect(this.saveBrandButton).toBeEnabled();
    console.log('BPR-P-011: optional warnings do not block Save brand.');
  }

  async saveBrand() {
    await this.saveBrandButton.scrollIntoViewIfNeeded();
    await expect(this.saveBrandButton).toBeEnabled();
    await this.saveBrandButton.click();
    await this.page.waitForURL(url => url.pathname.includes('/brand-lab'), { timeout: 30000 });
    await expect(this.libraryHeading).toBeVisible({ timeout: 30000 });
  }

  async getBrandProductCount(brandName) {
    const text = await this.getBrandCard(brandName).getByText(/\d+\s+products?/i).innerText();
    return Number(text.match(/\d+/)?.[0]);
  }

  async openAddProductModal(brandName) {
    const card = this.getBrandCard(brandName.trim());
    await expect(card).toBeVisible({ timeout: 30000 });
    await card.getByRole('button', { name: 'Add product', exact: true }).click();
    await expect(this.addProductDialog).toBeVisible();
    await expect(this.addProductDialog).toContainText(brandName);
    console.log(`PRD-P-001: Add Product modal opened for ${brandName}.`);
  }

  async fillProductDetails(data) {
    await this.productNameInput.fill(data.name.trim());
    await this.productUrlInput.fill(data.url.trim());
    await expect(this.productNameInput).toHaveValue(data.name.trim());
    await expect(this.productUrlInput).toHaveValue(data.url.trim());
  }

  async addAdditionalProductUrl(url) {
    if (!url?.trim()) return false;
    const before = await this.productUrlInputs.count();
    await this.addAnotherUrlButton.click();
    await expect(this.productUrlInputs).toHaveCount(before + 1);
    await this.productUrlInputs.nth(before).fill(url.trim());
    await expect(this.productUrlInputs.nth(before)).toHaveValue(url.trim());
    return true;
  }

  async uploadProductFile(path) {
    if (!path) return false;
    const input = this.addProductDialog.locator('input[type="file"]');
    await expect(input).toBeAttached();
    await input.setInputFiles(path);
    await expect(this.addProductDialog.getByText(/product-datasheet|\.pdf|\.docx|\.pptx/i).first()).toBeVisible();
    return true;
  }

  async submitProduct() {
    await expect(this.submitProductButton).toBeEnabled();
    await this.submitProductButton.click();
    await expect(this.addProductDialog).toBeHidden({ timeout: 30000 });
  }

  async verifyProductCountIncremented(brandName, initialCount) {
    await expect.poll(() => this.getBrandProductCount(brandName), { timeout: 30000 }).toBe(initialCount + 1);
    return initialCount + 1;
  }

  async verifyBrandHasProduct(brandName) {
    const count = await this.getBrandProductCount(brandName.trim());
    expect(count).toBeGreaterThan(0);
    return count;
  }
}

module.exports = { BrandLibraryPage };