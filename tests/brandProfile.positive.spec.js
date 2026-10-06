const { test, expect } = require('../fixtures/auth.fixture');
const { BrandLibraryPage } = require('../pages/BrandLibraryPage');

function requiredEnv(name) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value.trim();
}

function listEnv(name) {
  return requiredEnv(name).split(',').map(value => value.trim()).filter(Boolean);
}

test.describe('Redington AI Brand Profile — Positive Cases', () => {
  test('BPR-P-001 to BPR-P-003: reopen existing analyzed brand', async ({ authenticatedPage }) => {
    const library = new BrandLibraryPage(authenticatedPage);
    await library.openBrandLibrary();
    await library.openExistingBrand(requiredEnv('EXISTING_BRAND_NAME'));
    await library.verifyAiBrandProfile();
    await expect(authenticatedPage).toHaveURL(/\/create-brand\/[^/]+/);
  });

  test('BPR-P-004 to BPR-P-012: complete profile review and save brand', async ({ authenticatedPage }) => {
    test.setTimeout(180000);
    const library = new BrandLibraryPage(authenticatedPage);
    const brandName = requiredEnv('EXISTING_BRAND_NAME');
    await library.openBrandLibrary();
    await library.openExistingBrand(brandName);
    await library.verifyAiBrandProfile();
    await library.selectTargetPersonas(listEnv('BRAND_PERSONAS'));
    await library.selectContentPreferences(listEnv('CONTENT_PREFERENCES'));
    await library.verifyVoiceMessagingContent();
    await library.verifyDosAndDonts();
    await library.continueToReview();
    await library.verifyReviewPage(brandName);
    await library.verifyReviewSections();
    await library.verifyUploadedAssets();
    await library.verifyOptionalWarnings();
    await library.saveBrand();
    await expect(authenticatedPage).toHaveURL(/\/brand-lab/);
    await expect(authenticatedPage.getByText(brandName, { exact: true }).first()).toBeVisible();
  });
});