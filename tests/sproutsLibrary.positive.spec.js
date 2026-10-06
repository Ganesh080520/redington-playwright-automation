const {
  test,
  expect
} = require('../fixtures/auth.fixture');

const {
  SproutsLibraryPage
} = require('../pages/SproutsLibraryPage');

test.describe(
  'Redington Sprouts Library — Positive Cases',
  () => {
    test(
      'SPR-P-001: Sprouts Library loads',
      async ({ authenticatedPage }) => {
        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await expect(
          sproutsLibraryPage.companiesTab
        ).toBeVisible();

        await expect(
          sproutsLibraryPage.peopleTab
        ).toBeVisible();

        await expect(
          sproutsLibraryPage.enrichedTab
        ).toBeVisible();

        await sproutsLibraryPage
          .verifyUploadControlWithoutUploading();

        await sproutsLibraryPage
          .verifyDownloadTemplateControlWithoutClicking();
      }
    );

    test(
      'SPR-P-002 to SPR-P-004: verify Companies dataset, search and pagination',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('Companies');

        const count =
          await sproutsLibraryPage
            .getRecordCount();

        expect(count).toBeGreaterThan(0);

        await sproutsLibraryPage
          .verifyColumns([
            'Company',
            'Industry',
            'Employees',
            'Location',
            'Domain'
          ]);

        await sproutsLibraryPage
          .verifyRowsAvailable();

        await sproutsLibraryPage
          .verifyCurrentDatasetSearch();

        await sproutsLibraryPage
          .verifyPaginationControls();

        await sproutsLibraryPage
          .goToNextPageIfAvailable();
      }
    );

    test(
      'SPR-P-005 and SPR-P-007: verify People dataset and pagination',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('People');

        const count =
          await sproutsLibraryPage
            .getRecordCount();

        expect(count).toBeGreaterThan(0);

        await sproutsLibraryPage
          .verifyColumns([
            'Name',
            'Role',
            'Company',
            'Location',
            'Email?',
            'Source',
            'Uploaded'
          ]);

        await sproutsLibraryPage
          .verifyRowsAvailable();

        await sproutsLibraryPage
          .verifyPaginationControls();

        await sproutsLibraryPage
          .goToNextPageIfAvailable();
      }
    );

    test(
      'SPR-P-006: search People by an exact displayed name',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        // test.fail(
        //   true,
        //   'Known defect: People exact-name search returns no contacts.'
        // );

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('People');

        await sproutsLibraryPage
          .verifyRowsAvailable();

        await sproutsLibraryPage
          .verifyCurrentDatasetSearch();
      }
    );

    test(
      'SPR-P-008: verify Enriched contacts dataset',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('Enriched');

        const count =
          await sproutsLibraryPage
            .getRecordCount();

        expect(count).toBeGreaterThan(0);

        await sproutsLibraryPage
          .verifyColumns([
            'Name',
            'Role',
            'Company',
            'Location',
            'Email',
            'Phone',
            'Source',
            'Uploaded'
          ]);

        await sproutsLibraryPage
          .verifyRowsAvailable();
      }
    );

    test(
      'SPR-P-009: search Enriched contacts by an exact displayed name',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        // test.fail(
        //   true,
        //   'Known defect: Enriched exact-name search returns no contacts.'
        // );

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('Enriched');

        await sproutsLibraryPage
          .verifyRowsAvailable();

        await sproutsLibraryPage
          .verifyCurrentDatasetSearch();
      }
    );

    test(
      'SPR-P-010 to SPR-P-018: verify current Enriched filter dialog and reset',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('Enriched');

        await sproutsLibraryPage
          .openFilters();

        await sproutsLibraryPage
          .verifyFilterDialogControls();

        await sproutsLibraryPage
          .fillTextFilters({
            jobTitle: 'Software Engineer',
            company: 'Microsoft'
          });

        await sproutsLibraryPage
          .resetFilters();

        await sproutsLibraryPage
          .cancelFilters();

        await expect(
          sproutsLibraryPage.searchInput
        ).toBeVisible();

        // No data was modified.
      }
    );

    test(
      'SPR-P-019: apply a non-destructive Enriched job-title filter',
      async ({ authenticatedPage }) => {
        test.setTimeout(120000);

        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .selectDataset('Enriched');

        await sproutsLibraryPage
          .applyTextFilter({
            jobTitle: 'Software Engineer'
          });

        await expect(
          sproutsLibraryPage.searchInput
        ).toBeVisible();

        // An empty result is valid because the available
        // Enriched records can change.
      }
    );

    test(
      'SPR-P-020: verify Upload and template actions safely',
      async ({ authenticatedPage }) => {
        const sproutsLibraryPage =
          new SproutsLibraryPage(
            authenticatedPage
          );

        await sproutsLibraryPage
          .openSproutsLibrary();

        await sproutsLibraryPage
          .verifyUploadControlWithoutUploading();

        await sproutsLibraryPage
          .verifyDownloadTemplateControlWithoutClicking();

        // No template was downloaded.
        // No Excel/CSV file was uploaded.
      }
    );
  }
);

test(
  'SPR-P-021 to SPR-P-029: verify Company filters and reset',
  async ({ authenticatedPage }) => {
    test.setTimeout(120000);

    const sproutsLibraryPage =
      new SproutsLibraryPage(
        authenticatedPage
      );

    await sproutsLibraryPage
      .openSproutsLibrary();

    await sproutsLibraryPage
      .selectDataset('Companies');

    await sproutsLibraryPage
      .openFilters();

    await sproutsLibraryPage
      .verifyFilterDialogControls();

    const companyControls =
      await sproutsLibraryPage
        .fillCompanyTextFilters({
          domain: 'example.com',
          foundedYearFrom: '2000',
          foundedYearTo: '2024'
        });

    await sproutsLibraryPage
      .resetVisibleTextFilters(
        companyControls
      );

    await sproutsLibraryPage
      .cancelFilters();

    await expect(
      sproutsLibraryPage.searchInput
    ).toBeVisible();

    // No filter was applied and no data changed.
  }
);

test(
  'SPR-P-030 to SPR-P-036: verify People filters and reset',
  async ({ authenticatedPage }) => {
    test.setTimeout(120000);

    const sproutsLibraryPage =
      new SproutsLibraryPage(
        authenticatedPage
      );

    await sproutsLibraryPage
      .openSproutsLibrary();

    await sproutsLibraryPage
      .selectDataset('People');

    await sproutsLibraryPage
      .openFilters();

    await sproutsLibraryPage
      .verifyFilterDialogControls();

   const peopleControls =
  await sproutsLibraryPage
    .fillPeopleTextFilters({
      jobTitle: 'Software Engineer',
      company: 'Microsoft'
    });``

    await sproutsLibraryPage
      .resetVisibleTextFilters(
        peopleControls
      );

    await sproutsLibraryPage
      .cancelFilters();

    await expect(
      sproutsLibraryPage.searchInput
    ).toBeVisible();

    // No filter was applied and no data changed.
  }
);