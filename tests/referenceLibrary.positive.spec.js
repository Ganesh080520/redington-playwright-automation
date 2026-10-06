const {
  test,
  expect
} = require('../fixtures/auth.fixture');

const path =
  require('path');

const {
  ReferenceLibraryPage
} = require(
  '../pages/ReferenceLibraryPage'
);

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
  'Redington Reference Library — Positive Cases',
  () => {
    test(
      'REF-P-001: Reference Library loads',
      async ({ authenticatedPage }) => {
        const referenceLibraryPage =
          new ReferenceLibraryPage(
            authenticatedPage
          );

        await referenceLibraryPage
          .openReferenceLibrary();

        await expect(
          referenceLibraryPage
            .searchFilesInput
        ).toBeVisible();

        await expect(
          referenceLibraryPage
            .allFilesFilter
        ).toBeVisible();
      }
    );

    test(
      'REF-P-002 to REF-P-009: select brand and verify category filters',
      async ({ authenticatedPage }) => {
        const referenceLibraryPage =
          new ReferenceLibraryPage(
            authenticatedPage
          );

        const brandName =
          requiredEnv(
            'REFERENCE_LIBRARY_BRAND'
          );

        await referenceLibraryPage
          .openReferenceLibrary();

        await referenceLibraryPage
          .selectBrand(
            brandName
          );

        await referenceLibraryPage
          .verifyExpectedFilterCounts({
            allFiles:
              process.env
                .REFERENCE_ALL_FILES_COUNT ||
              3,

            logos:
              process.env
                .REFERENCE_LOGOS_COUNT ||
              1,

            guidelines:
              process.env
                .REFERENCE_GUIDELINES_COUNT ||
              1,

            productImagery:
              process.env
                .REFERENCE_PRODUCT_COUNT ||
              1,

            sampleCopy:
              process.env
                .REFERENCE_SAMPLE_COPY_COUNT ||
              0,

            caseStudies:
              process.env
                .REFERENCE_CASE_STUDIES_COUNT ||
              0,

            coloursFonts:
              process.env
                .REFERENCE_COLOURS_FONTS_COUNT ||
              0
          });

        await referenceLibraryPage
          .verifyCategoryFilters();
      }
    );

    test(
      'REF-P-010 to REF-P-014: verify uploaded Dell reference files',
      async ({ authenticatedPage }) => {
        const referenceLibraryPage =
          new ReferenceLibraryPage(
            authenticatedPage
          );

        const brandName =
          requiredEnv(
            'REFERENCE_LIBRARY_BRAND'
          );

        await referenceLibraryPage
          .openReferenceLibrary();

        await referenceLibraryPage
          .selectBrand(
            brandName
          );

        const assets =
          await referenceLibraryPage
            .verifyConfiguredFiles(
              brandName
            );

        expect(
          assets.productAsset
            .actionButtonCount
        ).toBeGreaterThanOrEqual(2);

        expect(
          assets.guidelineAsset
            .actionButtonCount
        ).toBeGreaterThanOrEqual(2);

        expect(
          assets.logoAsset
            .actionButtonCount
        ).toBeGreaterThanOrEqual(2);

        await referenceLibraryPage
          .verifyDeleteActionsWithoutClicking();
      }
    );

    test(
      'REF-P-015: search uploaded files',
      async ({ authenticatedPage }) => {
        const referenceLibraryPage =
          new ReferenceLibraryPage(
            authenticatedPage
          );

        const brandName =
          requiredEnv(
            'REFERENCE_LIBRARY_BRAND'
          );

        const guidelineFileName =
          path.basename(
            requiredEnv(
              'GUIDELINES_FILE'
            )
          );

        await referenceLibraryPage
          .openReferenceLibrary();

        await referenceLibraryPage
          .selectBrand(
            brandName
          );

        await referenceLibraryPage
          .searchFiles(
            guidelineFileName
          );

        const matchingCount =
          await referenceLibraryPage
            .verifySearchedFileVisible(
              guidelineFileName
            );

        expect(
          matchingCount
        ).toBeGreaterThan(0);

        await referenceLibraryPage
          .clearSearch();

        // Safety boundary:
        // Do not click any Delete action.
      }
    );
  }
);