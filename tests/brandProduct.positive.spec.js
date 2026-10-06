const { test, expect } = require('../fixtures/auth.fixture');
const { BrandLibraryPage } = require('../pages/BrandLibraryPage');
const { optionalFile } = require('../utils/env');

function requiredEnv(name) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value.trim();
}

test.describe('Redington Brand Product — Positive Cases', () => {
  test('PRD-P-001 to PRD-P-005: add product URLs/file and verify count increment', async ({ authenticatedPage }) => {
    test.setTimeout(120000);
    const library = new BrandLibraryPage(authenticatedPage);
    const brandName = requiredEnv('EXISTING_BRAND_NAME');
    const additionalUrl = requiredEnv('BRAND_PRODUCT_ADDITIONAL_URL');
    const productFile = optionalFile('PRODUCT_FILE');
    if (!productFile) {
      throw new Error('PRODUCT_FILE must reference an existing supported file.');
    }
    await library.openBrandLibrary();
    const initialCount = await library.getBrandProductCount(brandName);
    await library.openAddProductModal(brandName);
    await library.fillProductDetails({
      name: requiredEnv('BRAND_PRODUCT_NAME'),
      url: requiredEnv('BRAND_PRODUCT_URL')
    });

    expect(await library.addAdditionalProductUrl(additionalUrl)).toBeTruthy();
    expect(await library.uploadProductFile(productFile)).toBeTruthy();

    await library.submitProduct();
    await library.verifyProductCountIncremented(brandName, initialCount);
  });
});
