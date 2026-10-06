const { test, expect } = require('../fixtures/auth.fixture');
const { BrandCreationPage } = require('../pages/BrandCreationPage');
const { optionalFile } = require('../utils/env');

test.describe('Redington Brand Creation — Positive Cases', () => {
  test('BRD-P-001: Create Brand page loads', async ({ authenticatedPage }) => {
    const page = new BrandCreationPage(authenticatedPage);
    await page.openCreateBrand();
    await expect(page.heading).toBeVisible();
    await expect(page.brandNameInput).toBeVisible();
    await expect(page.analyzeButton).toBeVisible();
  });

  test('BRD-P-002 to BRD-P-011: complete mandatory sources and analyze with AI', async ({ authenticatedPage }) => {
    test.setTimeout(180000);
    const page = new BrandCreationPage(authenticatedPage);
    const guidelines = optionalFile('GUIDELINES_FILE');
    const logo = optionalFile('PRIMARY_LOGO_FILE');
    if (!guidelines || !logo) throw new Error('GUIDELINES_FILE and PRIMARY_LOGO_FILE must exist.');
    const data = {
      brandName: process.env.BRAND_NAME || `Automation Brand ${Date.now()}`,
      websiteUrl: process.env.BRAND_WEBSITE || 'https://www.cisco.com',
      brandPortfolio: process.env.BRAND_PORTFOLIO || 'Networking',
      productPortfolio: process.env.PRODUCT_PORTFOLIO || 'Networking',
      tagline: process.env.TAGLINE || 'The bridge to possible',
      assetBrand: process.env.ASSET_BRAND || 'Cisco',
      segment: process.env.SEGMENT || 'Enterprise'
    };
    await page.openCreateBrand();
    await page.enterBasicDetails(data);
    await page.verifyBasicDetails(data);
    await page.uploadGuidelines(guidelines);
    await page.uploadLogo('Primary logo', logo);
    await page.analyzeBrand();
  });

  test('BRD-P-014: Cancel safely leaves an unsaved brand draft', async ({ authenticatedPage }) => {
    const page = new BrandCreationPage(authenticatedPage);
    await page.openCreateBrand();
    await page.cancelDraft();
  });
});