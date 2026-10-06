const {
  test,
  expect
} = require('../fixtures/auth.fixture');

const {
  BrandAssetsPage
} = require('../pages/BrandAssetsPage');

function requiredEnv(name) {
  const value =
    process.env[name];

  if (!value?.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value.trim();
}

test.describe(
  'Redington Brand Assets — Positive Cases',
  () => {
    test(
      'BAS-P-001: Brand Assets library loads',
      async ({ authenticatedPage }) => {
        const brandAssetsPage =
          new BrandAssetsPage(
            authenticatedPage
          );

        await brandAssetsPage
          .openBrandAssets();

        await brandAssetsPage
          .verifyLibraryControls();

        await expect(
          brandAssetsPage.generateNewButton
        ).toBeVisible();
      }
    );

    test(
      'BAS-P-002 to BAS-P-005: select brand and verify asset filters and search',
      async ({ authenticatedPage }) => {
        const brandAssetsPage =
          new BrandAssetsPage(
            authenticatedPage
          );

        const brandName =
          requiredEnv(
            'BRAND_ASSET_BRAND'
          );

        await brandAssetsPage
          .openBrandAssets();

        await brandAssetsPage
          .selectBrand(
            brandName
          );

        await brandAssetsPage
          .verifyAssetFilters();

        await brandAssetsPage
          .verifyAssetSearch(
            process.env
              .BRAND_ASSET_SEARCH ||
            'Dell'
          );

        await brandAssetsPage
          .verifyAssetLibraryState();
      }
    );

    test(
      'BAS-P-006 to BAS-P-012: open Brand Lab and verify creative kit configuration',
      async ({ authenticatedPage }) => {
        test.setTimeout(180000);

        const brandAssetsPage =
          new BrandAssetsPage(
            authenticatedPage
          );

        const creativeBrief = {
          brand:
            requiredEnv(
              'BRAND_ASSET_BRAND'
            ),

          product:
            requiredEnv(
              'BRAND_ASSET_PRODUCT'
            ),

          objective:
            requiredEnv(
              'BRAND_ASSET_OBJECTIVE'
            ),

          persona:
            requiredEnv(
              'BRAND_ASSET_PERSONA'
            )
        };

        await brandAssetsPage
          .openBrandAssets();

        await brandAssetsPage
          .selectBrand(
            creativeBrief.brand
          );

        await brandAssetsPage
          .openGenerateCreativeKit();

        await brandAssetsPage
          .configureCreativeBrief(
            creativeBrief
          );

        await brandAssetsPage
          .verifyCreativeBrief(
            creativeBrief
          );

        await brandAssetsPage
          .verifyEmbeddedStudio();

        await brandAssetsPage
          .verifyGeneratedAssetsSection();

        await brandAssetsPage
          .verifyCreativeKitActions();

        await expect(
          authenticatedPage
        ).toHaveURL(
          /\/brand-lab\/generate/
        );

        // Safety boundary:
        // Do not click Generate creative kit because
        // it may trigger AI generation or external usage.
      }
    );


    test(
  'BAS-P-013 to BAS-P-017: verify empty Kit review and push state safely',
  async ({ authenticatedPage }) => {
    test.setTimeout(180000);

    const brandAssetsPage =
      new BrandAssetsPage(
        authenticatedPage
      );

    const creativeBrief = {
      brand:
        requiredEnv(
          'BRAND_ASSET_BRAND'
        ),

      product:
        requiredEnv(
          'BRAND_ASSET_PRODUCT'
        ),

      objective:
        requiredEnv(
          'BRAND_ASSET_OBJECTIVE'
        ),

      persona:
        requiredEnv(
          'BRAND_ASSET_PERSONA'
        )
    };

    await brandAssetsPage
      .openBrandAssets();

    await brandAssetsPage
      .selectBrand(
        creativeBrief.brand
      );

    await brandAssetsPage
      .openGenerateCreativeKit();

    await brandAssetsPage
      .configureCreativeBrief(
        creativeBrief
      );

    await brandAssetsPage
      .verifyCreativeBrief(
        creativeBrief
      );

    await brandAssetsPage
      .openKitReviewAndPush();

    const summary =
      await brandAssetsPage
        .verifyEmptyKitState();

    expect(
      summary.kitCreatives
    ).toBe(0);

    expect(
      summary.approved
    ).toBe(0);

    expect(
      summary.pendingApproval
    ).toBe(0);

    // Safety boundaries:
    // Do not click Approve all remaining.
    // Do not click Push approved creatives.
    // Do not generate AI content in this test.

    await brandAssetsPage
      .returnToCreativeBrief();
  }
);
  }
);