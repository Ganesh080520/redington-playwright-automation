const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class SproutsLibraryPage extends BasePage {
  constructor(page) {
    super(page);

    // ==========================================
    // PAGE
    // ==========================================

    this.heading = page.getByRole('heading', {
      name: 'Sprouts Library',
      exact: true
    }).last();

    this.description = page.getByText(
      /Download a template.*upload companies or contacts/i
    ).first();

    this.downloadTemplateButton =
      page.getByRole('button', {
        name: /Download template/i
      }).first();

    this.uploadButton = page.getByRole('button', {
      name: /^Upload$/i
    }).first();

    // ==========================================
    // DATASET TABS
    // ==========================================

    this.companiesTab = page.getByRole('button', {
      name: /^Companies$/i
    }).first();

    this.peopleTab = page.getByRole('button', {
      name: /^People$/i
    }).first();

    this.enrichedTab = page.getByRole('button', {
      name: /^Enriched$/i
    }).first();

    // ==========================================
    // COMMON CONTROLS
    // ==========================================

    this.searchInput = page.locator(
      'input[placeholder*="Search" i]'
    ).first();

    this.filtersButton = page.getByRole('button', {
      name: /^Filters$/i
    }).first();

    this.clearButton = page.getByRole('button', {
      name: /^Clear$/i
    }).first();

    this.previousButton = page.getByRole('button', {
      name: /^Previous$/i
    }).last();

    this.nextButton = page.getByRole('button', {
      name: /^Next$/i
    }).last();

    this.noResultsMessage = page.getByText(
      /No (companies|people|contacts) found/i
    ).first();

    // Updated after selecting a dataset.
    this.currentDataset = null;
    this.currentColumns = [];
    this.headerRow = null;
    this.tableRows = null;

    // Retained for compatibility with the spec.
    this.table = page.locator('body');

    // ==========================================
    // FILTER DIALOG
    // ==========================================

    this.filterDialog = null;
    this.filterDialogTitle = null;
    this.resetButton = null;
    this.cancelButton = null;
    this.applyFiltersButton = null;
    this.jobTitleInput = null;
    this.companyInput = null;
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  escapeRegExp(value) {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
  }

  getDatasetConfiguration(datasetName) {
    const configurations = {
      Companies: {
        tab: this.companiesTab,
        placeholder:
          /Search by name or domain/i,
        countLabel:
          /companies/i,
        columns: [
          'Company',
          'Industry',
          'Employees',
          'Location',
          'Domain'
        ]
      },

      People: {
        tab: this.peopleTab,
        placeholder:
          /Search people/i,
        countLabel:
          /(people|contacts)/i,
        columns: [
          'Name',
          'Role',
          'Company',
          'Location'
        ]
      },

      Enriched: {
        tab: this.enrichedTab,
        placeholder:
          /Search enriched contacts/i,
        countLabel:
          /contacts/i,
        columns: [
          'Name',
          'Role',
          'Company',
          'Location',
          'Email',
          'Phone',
          'Source',
          'Uploaded'
        ]
      }
    };

    const configuration =
      configurations[datasetName];

    if (!configuration) {
      throw new Error(
        `Unsupported Sprouts dataset: ${datasetName}`
      );
    }

    return configuration;
  }

  // ==========================================
  // OPEN PAGE
  // ==========================================

  async openSproutsLibrary() {
    console.log('Opening Sprouts Library...');

    await this.open('/sprouts-library');

    let pageLoaded = await this.companiesTab
      .waitFor({
        state: 'visible',
        timeout: 15000
      })
      .then(() => true)
      .catch(() => false);

    if (!pageLoaded) {
      console.log(
        'Opening Sprouts Library from sidebar.'
      );

      const sidebarLink = this.page.getByText(
        'Sprouts Library',
        { exact: true }
      ).first();

      await expect(sidebarLink).toBeVisible({
        timeout: 15000
      });

      await sidebarLink.click();

      pageLoaded = await this.companiesTab
        .waitFor({
          state: 'visible',
          timeout: 30000
        })
        .then(() => true)
        .catch(() => false);
    }

    expect(
      pageLoaded,
      'Sprouts Library controls did not load.'
    ).toBeTruthy();

    await expect(this.heading).toBeVisible({
      timeout: 30000
    });

    await expect(this.uploadButton).toBeVisible();
    await expect(this.companiesTab).toBeVisible();
    await expect(this.peopleTab).toBeVisible();
    await expect(this.enrichedTab).toBeVisible();

    const templateVisible =
      await this.downloadTemplateButton
        .isVisible()
        .catch(() => false);

    if (templateVisible) {
      console.log(
        'Download template action is visible.'
      );
    }

    const descriptionVisible =
      await this.description
        .isVisible()
        .catch(() => false);

    if (descriptionVisible) {
      console.log(
        'Current Sprouts Library description is visible.'
      );
    } else {
      console.log(
        'Description copy was not found; ' +
        'core controls loaded successfully.'
      );
    }

    console.log(
      'Sprouts Library loaded successfully.'
    );

    console.log(
      `Current URL: ${this.page.url()}`
    );
  }

  // ==========================================
  // SELECT DATASET
  // ==========================================

  async selectDataset(datasetName) {
    const configuration =
      this.getDatasetConfiguration(
        datasetName
      );

    await expect(
      configuration.tab
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      configuration.tab
    ).toBeEnabled();

    await configuration.tab.click();

    await expect(
      this.searchInput
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.searchInput
    ).toHaveAttribute(
      'placeholder',
      configuration.placeholder
    );

    this.currentDataset =
      datasetName;

    this.currentColumns =
      configuration.columns;

    await this.resolveDataGrid(
      datasetName
    );

    console.log(
      `Sprouts dataset selected: ${datasetName}`
    );
  }

  // ==========================================
  // RESOLVE DIV-BASED GRID
  // ==========================================

  async resolveDataGrid(datasetName) {
    const configuration =
      this.getDatasetConfiguration(
        datasetName
      );

    const firstColumn =
      configuration.columns[0];

    const headerMatches =
      this.page.getByText(
        new RegExp(
          `^${this.escapeRegExp(firstColumn)}$`,
          'i'
        )
      );

    const headerCount =
      await headerMatches.count();

    let visibleFirstHeader = null;

    for (
      let index = 0;
      index < headerCount;
      index += 1
    ) {
      const candidate =
        headerMatches.nth(index);

      if (
        await candidate
          .isVisible()
          .catch(() => false)
      ) {
        visibleFirstHeader = candidate;
        break;
      }
    }

    if (!visibleFirstHeader) {
      throw new Error(
        `Visible ${firstColumn} header was not found.`
      );
    }

    let resolvedHeaderRow = null;

    for (
      let level = 1;
      level <= 6;
      level += 1
    ) {
      const candidate =
        visibleFirstHeader.locator(
          `xpath=ancestor::div[${level}]`
        );

      const exists =
        await candidate
          .count()
          .then((count) => count > 0)
          .catch(() => false);

      if (!exists) {
        continue;
      }

      const candidateText = (
        await candidate
          .innerText()
          .catch(() => '')
      ).replace(/\s+/g, ' ').trim();

      const coreColumns =
        configuration.columns.slice(
          0,
          Math.min(
            4,
            configuration.columns.length
          )
        );

      const containsCoreColumns =
        coreColumns.every(
          (column) =>
            candidateText
              .toLowerCase()
              .includes(
                column.toLowerCase()
              )
        );

      if (containsCoreColumns) {
        resolvedHeaderRow =
          candidate;

        break;
      }
    }

    if (!resolvedHeaderRow) {
      throw new Error(
        `Unable to resolve the ${datasetName} grid header.`
      );
    }

    this.headerRow =
      resolvedHeaderRow;

    this.tableRows = this.headerRow.locator(
      'xpath=following-sibling::div'
    );

    this.table =
      this.headerRow.locator('..');

    await expect(
      this.table
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      `${datasetName} div-based data grid resolved.`
    );
  }

  // ==========================================
  // RECORD COUNT
  // ==========================================

  async getRecordCount() {
    const countBadge = this.page.getByText(
      /^\s*[\d,]+\s+(companies|people|contacts)\s*$/i
    ).first();

    await expect(
      countBadge
    ).toBeVisible({
      timeout: 15000
    });

    const displayedText = (
      await countBadge.innerText()
    ).replace(/\s+/g, ' ').trim();

    const countMatch =
      displayedText.match(/([\d,]+)/);

    if (!countMatch) {
      throw new Error(
        `Record count was not found: ${displayedText}`
      );
    }

    const recordCount = Number(
      countMatch[1].replace(/,/g, '')
    );

    expect(
      Number.isNaN(recordCount)
    ).toBeFalsy();

    expect(
      recordCount
    ).toBeGreaterThanOrEqual(0);

    console.log(
      `Displayed record count: ${recordCount}`
    );

    return recordCount;
  }

  // ==========================================
  // VERIFY COLUMNS
  // ==========================================

  async verifyColumns(expectedColumns) {
    for (const expectedColumn of expectedColumns) {
      const matchingHeaders =
        this.page.getByText(
          new RegExp(
            `^${this.escapeRegExp(expectedColumn)}$`,
            'i'
          )
        );

      const matchCount =
        await matchingHeaders.count();

      let visibleHeaderFound = false;

      for (
        let index = 0;
        index < matchCount;
        index += 1
      ) {
        if (
          await matchingHeaders
            .nth(index)
            .isVisible()
            .catch(() => false)
        ) {
          visibleHeaderFound = true;
          break;
        }
      }

      expect(
        visibleHeaderFound,
        `Missing visible grid column: ${expectedColumn}`
      ).toBeTruthy();
    }

    console.log(
      `Verified columns: ${expectedColumns.join(', ')}`
    );

    return expectedColumns;
  }

  // ==========================================
  // DATA ROWS
  // ==========================================

  async getVisibleDataRows() {
    if (!this.tableRows) {
      throw new Error(
        'Select a dataset before accessing rows.'
      );
    }

    const candidateCount =
      await this.tableRows.count();

    const visibleRows = [];

    for (
      let index = 0;
      index < candidateCount;
      index += 1
    ) {
      const candidate =
        this.tableRows.nth(index);

      const visible =
        await candidate
          .isVisible()
          .catch(() => false);

      if (!visible) {
        continue;
      }

      const text = (
        await candidate
          .innerText()
          .catch(() => '')
      ).replace(/\s+/g, ' ').trim();

      if (
        text &&
        !/^Page \d+ of \d+$/i.test(text) &&
        !/^(Previous|Next)$/i.test(text)
      ) {
        visibleRows.push(candidate);
      }
    }

    return visibleRows;
  }

  async verifyRowsAvailable() {
    const visibleRows =
      await this.getVisibleDataRows();

    expect(
      visibleRows.length,
      `${this.currentDataset} has no visible rows.`
    ).toBeGreaterThan(0);

    console.log(
      `Visible data rows: ${visibleRows.length}`
    );

    return visibleRows.length;
  }

  async getFirstRowFirstValue() {
    const visibleRows =
      await this.getVisibleDataRows();

    expect(
      visibleRows.length,
      'No row is available for dynamic search.'
    ).toBeGreaterThan(0);

    const firstRow =
      visibleRows[0];

    const firstValue =
      await firstRow.evaluate((row) => {
        const descendants = Array.from(
          row.querySelectorAll('*')
        );

        const leafElements =
          descendants.filter((element) => {
            const text = (
              element.textContent || ''
            ).replace(/\s+/g, ' ').trim();

            const style =
              window.getComputedStyle(element);

            return (
              element.children.length === 0 &&
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              text.length > 0 &&
              text !== '—'
            );
          });

        return leafElements.length > 0
          ? (
              leafElements[0].textContent || ''
            ).replace(/\s+/g, ' ').trim()
          : '';
      });

    if (!firstValue) {
      throw new Error(
        'The first row has no searchable value.'
      );
    }

    console.log(
      `Dynamic search value: ${firstValue}`
    );

    return firstValue;
  }

  // ==========================================
  // SEARCH
  // ==========================================

  async searchCurrentDataset(searchText) {
    if (!searchText?.trim()) {
      throw new Error(
        'A search value is required.'
      );
    }

    const requiredValue =
      searchText.trim();

    await this.searchInput.fill(
      requiredValue
    );

    await expect(
      this.searchInput
    ).toHaveValue(
      requiredValue
    );

    await this.page.waitForTimeout(1000);

    console.log(
      `Sprouts search entered: ${requiredValue}`
    );
  }

  async verifySearchResult(searchText) {
    await expect
      .poll(
        async () => {
          const noResultsVisible =
            await this.noResultsMessage
              .isVisible()
              .catch(() => false);

          if (noResultsVisible) {
            return false;
          }

          const visibleRows =
            await this.getVisibleDataRows();

          for (const row of visibleRows) {
            const rowText = (
              await row
                .innerText()
                .catch(() => '')
            ).replace(/\s+/g, ' ').trim();

            if (
              rowText
                .toLowerCase()
                .includes(
                  searchText.toLowerCase()
                )
            ) {
              return true;
            }
          }

          return false;
        },
        {
          timeout: 15000,
          message:
            `No visible search result contains: ${searchText}`
        }
      )
      .toBe(true);

    console.log(
      `Search result verified: ${searchText}`
    );
  }

  async clearSearch() {
    const clearVisible =
      await this.clearButton
        .isVisible()
        .catch(() => false);

    if (clearVisible) {
      await this.clearButton.click();
    } else {
      await this.searchInput.clear();
    }

    await expect(
      this.searchInput
    ).toHaveValue('');

    await this.page.waitForTimeout(750);

    if (this.currentDataset) {
      await this.resolveDataGrid(
        this.currentDataset
      );
    }

    console.log(
      'Sprouts search cleared.'
    );
  }

  async verifyCurrentDatasetSearch() {
    const searchValue =
      await this.getFirstRowFirstValue();

    await this.searchCurrentDataset(
      searchValue
    );

    await this.verifySearchResult(
      searchValue
    );

    await this.clearSearch();

    return searchValue;
  }

  // ==========================================
  // FILTER DIALOG
  // ==========================================

  async openFilters() {
    await expect(
      this.filtersButton
    ).toBeVisible({
      timeout: 15000
    });

    await expect(
      this.filtersButton
    ).toBeEnabled();

    await this.filtersButton.click();

    await this.resolveVisibleFilterDialog();

    await expect(
      this.filterDialogTitle
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Sprouts filter dialog opened.'
    );
  }

  async resolveVisibleFilterDialog() {
    const possibleTitles =
      this.page.getByText(
        /^(Company|People|Enriched contact) filters$/i
      );

    const titleCount =
      await possibleTitles.count();

    let visibleTitle = null;

    for (
      let index = 0;
      index < titleCount;
      index += 1
    ) {
      const candidate =
        possibleTitles.nth(index);

      if (
        await candidate
          .isVisible()
          .catch(() => false)
      ) {
        visibleTitle = candidate;
        break;
      }
    }

    if (!visibleTitle) {
      throw new Error(
        'No visible filter dialog title was found.'
      );
    }

    let resolvedDialog = null;

    for (
      let level = 1;
      level <= 7;
      level += 1
    ) {
      const candidate =
        visibleTitle.locator(
          `xpath=ancestor::div[${level}]`
        );

      const applyVisible =
        await candidate
          .getByRole('button', {
            name: /^Apply filters$/i
          })
          .isVisible()
          .catch(() => false);

      if (applyVisible) {
        resolvedDialog =
          candidate;

        break;
      }
    }

    if (!resolvedDialog) {
      throw new Error(
        'Unable to resolve the visible filter dialog.'
      );
    }

    this.filterDialogTitle =
      visibleTitle;

    this.filterDialog =
      resolvedDialog;

    this.resetButton =
      resolvedDialog.getByRole(
        'button',
        { name: /^Reset$/i }
      );

    this.cancelButton =
      resolvedDialog.getByRole(
        'button',
        { name: /^Cancel$/i }
      );

    this.applyFiltersButton =
      resolvedDialog.getByRole(
        'button',
        { name: /^Apply filters$/i }
      );

    this.jobTitleInput =
      resolvedDialog.getByPlaceholder(
        'e.g. Software Engineer',
        { exact: true }
      );

    this.companyInput =
      resolvedDialog.getByPlaceholder(
        'Partial company name',
        { exact: true }
      );

    console.log(
      `Visible filter dialog resolved: ${
        await visibleTitle.innerText()
      }`
    );
  }

 async verifyFilterDialogControls() {
  const filterConfigurations = {
  Companies: {
    title: 'Company filters',

    labels: [
      'Upload date from',
      'Upload date to',
      'Source',
      'Business type',
      'Company keyword',
      'Employee count',
      'Funding stage',
      'Industry',
      'Location',
      'Domain',
      'Founded year from',
      'Founded year to'
    ],

    placeholders: [
      'Select business type',
      'Select company keyword',
      'Select employee count',
      'Select funding stage',
      'Select industry',
      'Select location',
      'Add domains',
      'e.g. 2000',
      'e.g. 2024'
    ],

    hasUploadDates: true
  },

  People: {
    title: 'People filters',

    labels: [
      'Upload date from',
      'Upload date to',
      'Source',
      'Department',
      'Seniority',
      'Country',
      'Job title',
      'Company',
      'Email',
      'Phone'
    ],

    placeholders: [
      'Select department',
      'Select seniority',
      'Select country',
      'e.g. Software Engineer',
      'Partial company name'
    ],

    hasUploadDates: true
  },

  Enriched: {
    title: 'Enriched contact filters',

    labels: [
      'Upload date from',
      'Upload date to',
      'Source',
      'Department',
      'Seniority',
      'Country',
      'Job title',
      'Company',
      'Email',
      'Phone'
    ],

    placeholders: [
      'Select department',
      'Select seniority',
      'Select country',
      'e.g. Software Engineer',
      'Partial company name'
    ],

    hasUploadDates: true
  }
};

  const configuration =
    filterConfigurations[
      this.currentDataset
    ];

  if (!configuration) {
    throw new Error(
      `No filter configuration exists for: ${this.currentDataset}`
    );
  }

  await expect(
    this.filterDialogTitle
  ).toHaveText(
    configuration.title
  );

  for (
    const expectedLabel
    of configuration.labels
  ) {
    const labels =
      this.filterDialog.getByText(
        expectedLabel,
        { exact: true }
      );

    const labelCount =
      await labels.count();

    let visibleLabelFound = false;

    for (
      let index = 0;
      index < labelCount;
      index += 1
    ) {
      if (
        await labels
          .nth(index)
          .isVisible()
          .catch(() => false)
      ) {
        visibleLabelFound = true;
        break;
      }
    }

    expect(
      visibleLabelFound,
      `Missing visible ${this.currentDataset} filter label: ${expectedLabel}`
    ).toBeTruthy();
  }

  for (
    const placeholder
    of configuration.placeholders
  ) {
    const controls =
      this.filterDialog.getByPlaceholder(
        placeholder,
        { exact: true }
      );

    const controlCount =
      await controls.count();

    let visibleControlFound = false;

    for (
      let index = 0;
      index < controlCount;
      index += 1
    ) {
      const control =
        controls.nth(index);

      if (
        await control
          .isVisible()
          .catch(() => false)
      ) {
        visibleControlFound = true;
        break;
      }
    }

    expect(
      visibleControlFound,
      `Missing visible ${this.currentDataset} filter control: ${placeholder}`
    ).toBeTruthy();
  }

  if (configuration.hasUploadDates) {
    const dateFormatControls =
      this.filterDialog.getByText(
        'YYYY-MM-DD',
        { exact: true }
      );

    const dateFormatCount =
      await dateFormatControls.count();

    let visibleDateControlCount = 0;

    for (
      let index = 0;
      index < dateFormatCount;
      index += 1
    ) {
      if (
        await dateFormatControls
          .nth(index)
          .isVisible()
          .catch(() => false)
      ) {
        visibleDateControlCount += 1;
      }
    }

    expect(
      visibleDateControlCount,
      'Expected two visible upload-date controls.'
    ).toBeGreaterThanOrEqual(2);

    console.log(
      'Upload date from and Upload date to controls verified.'
    );
  }

  await this.applyFiltersButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.resetButton
  ).toBeVisible();

  await expect(
    this.cancelButton
  ).toBeVisible();

  await expect(
    this.applyFiltersButton
  ).toBeVisible();

  console.log(
    `${this.currentDataset} filter controls verified.`
  );
}


  async fillTextFilters({
    jobTitle,
    company
  }) {
    if (jobTitle?.trim()) {
      await this.jobTitleInput
        .scrollIntoViewIfNeeded();

      await this.jobTitleInput.fill(
        jobTitle.trim()
      );

      await expect(
        this.jobTitleInput
      ).toHaveValue(
        jobTitle.trim()
      );

      console.log(
        `Job title filter entered: ${jobTitle.trim()}`
      );
    }

    if (company?.trim()) {
      await this.companyInput
        .scrollIntoViewIfNeeded();

      await this.companyInput.fill(
        company.trim()
      );

      await expect(
        this.companyInput
      ).toHaveValue(
        company.trim()
      );

      console.log(
        `Company filter entered: ${company.trim()}`
      );
    }
  }

  async resetFilters() {
    await this.resetButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.resetButton
    ).toBeEnabled();

    await this.resetButton.click();

    await expect(
      this.jobTitleInput
    ).toHaveValue('');

    await expect(
      this.companyInput
    ).toHaveValue('');

    console.log(
      'Enriched filters reset successfully.'
    );
  }

  async cancelFilters() {
    await this.cancelButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.cancelButton
    ).toBeEnabled();

    await this.cancelButton.click();

    await expect(
      this.filterDialogTitle
    ).toBeHidden({
      timeout: 10000
    });

    console.log(
      'Filter dialog cancelled.'
    );
  }

  async applyTextFilter({
    jobTitle,
    company
  }) {
    await this.openFilters();

    await this.fillTextFilters({
      jobTitle,
      company
    });

    await this.applyFiltersButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.applyFiltersButton
    ).toBeEnabled();

    await this.applyFiltersButton.click();

    await expect(
      this.filterDialogTitle
    ).toBeHidden({
      timeout: 15000
    });

    await expect(
      this.searchInput
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Enriched filters applied.'
    );
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  async verifyPaginationControls() {
    await this.nextButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.previousButton
    ).toBeVisible();

    await expect(
      this.nextButton
    ).toBeVisible();

    console.log(
      'Sprouts pagination controls verified.'
    );
  }

  async goToNextPageIfAvailable() {
    await this.nextButton
      .scrollIntoViewIfNeeded();

    const nextEnabled =
      await this.nextButton.isEnabled();

    if (!nextEnabled) {
      console.log(
        'Next pagination control is disabled.'
      );

      return false;
    }

    const firstValueBefore =
      await this.getFirstRowFirstValue();

    await this.nextButton.click();

    await expect
      .poll(
        async () => {
          await this.resolveDataGrid(
            this.currentDataset
          );

          return this.getFirstRowFirstValue();
        },
        {
          timeout: 15000,
          message:
            'The first record did not change after selecting Next.'
        }
      )
      .not.toBe(firstValueBefore);

    console.log(
      'Sprouts pagination moved to the next page.'
    );

    return true;
  }

  // ==========================================
  // SAFE ACTION CHECKS
  // ==========================================

  async verifyUploadControlWithoutUploading() {
    await expect(
      this.uploadButton
    ).toBeVisible();

    await expect(
      this.uploadButton
    ).toBeEnabled();

    console.log(
      'Sprouts Upload action is available.'
    );

    console.log(
      'No Excel or CSV file was uploaded.'
    );
  }

  async verifyDownloadTemplateControlWithoutClicking() {
    const visible =
      await this.downloadTemplateButton
        .isVisible()
        .catch(() => false);

    if (visible) {
      await expect(
        this.downloadTemplateButton
      ).toBeEnabled();

      console.log(
        'Download template action is available.'
      );
    }
  }


  async fillCompanyTextFilters({
  domain,
  foundedYearFrom,
  foundedYearTo
}) {
  if (
    this.currentDataset !== 'Companies'
  ) {
    throw new Error(
      'Company filters require the Companies dataset.'
    );
  }

  const domainInput =
    this.filterDialog.getByPlaceholder(
      'Add domains',
      { exact: true }
    );

  const foundedYearFromInput =
    this.filterDialog.getByPlaceholder(
      'e.g. 2000',
      { exact: true }
    );

  const foundedYearToInput =
    this.filterDialog.getByPlaceholder(
      'e.g. 2024',
      { exact: true }
    );

  if (domain?.trim()) {
    await domainInput.fill(
      domain.trim()
    );

    await expect(
      domainInput
    ).toHaveValue(
      domain.trim()
    );
  }

  if (foundedYearFrom?.trim()) {
    await foundedYearFromInput.fill(
      foundedYearFrom.trim()
    );

    await expect(
      foundedYearFromInput
    ).toHaveValue(
      foundedYearFrom.trim()
    );
  }

  if (foundedYearTo?.trim()) {
    await foundedYearToInput.fill(
      foundedYearTo.trim()
    );

    await expect(
      foundedYearToInput
    ).toHaveValue(
      foundedYearTo.trim()
    );
  }

  console.log(
    'Company text filters populated.'
  );

  return {
    domainInput,
    foundedYearFromInput,
    foundedYearToInput
  };
}

async fillPeopleTextFilters({
  jobTitle,
  company
}) {
  if (
    this.currentDataset !== 'People'
  ) {
    throw new Error(
      'People filters require the People dataset.'
    );
  }

  const jobTitleInput =
    this.filterDialog.getByPlaceholder(
      'e.g. Software Engineer',
      { exact: true }
    );

  const companyInput =
    this.filterDialog.getByPlaceholder(
      'Partial company name',
      { exact: true }
    );

  if (jobTitle?.trim()) {
    await jobTitleInput.fill(
      jobTitle.trim()
    );

    await expect(
      jobTitleInput
    ).toHaveValue(
      jobTitle.trim()
    );
  }

  if (company?.trim()) {
    await companyInput.fill(
      company.trim()
    );

    await expect(
      companyInput
    ).toHaveValue(
      company.trim()
    );
  }

  console.log(
    'People text filters populated.'
  );

  return {
    jobTitleInput,
    companyInput
  };
}

async resetVisibleTextFilters(
  controls
) {
  await this.resetButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.resetButton
  ).toBeEnabled();

  await this.resetButton.click();

  for (
    const control
    of Object.values(controls)
  ) {
    await expect(
      control
    ).toHaveValue('');
  }

  console.log(
    `${this.currentDataset} filters reset successfully.`
  );
}
}

module.exports = {
  SproutsLibraryPage
};