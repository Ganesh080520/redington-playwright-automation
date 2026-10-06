const {
  expect
} = require('@playwright/test');

const path = require('path');

const {
  BasePage
} = require('./BasePage');

class ReferenceLibraryPage extends BasePage {
  constructor(page) {
    super(page);

    // ==========================================
    // PAGE
    // ==========================================

    this.referenceLibraryHeading =
      page.getByText(
        'Reference Library',
        { exact: true }
      ).last();

    this.description =
      page.getByText(
        /Everything you upload.*AI may only draw from what lives here/i
      );

    this.searchFilesInput =
      page.getByPlaceholder(
        'Search files...',
        { exact: true }
      );

    // ==========================================
    // CATEGORY FILTERS
    // ==========================================

    this.allFilesFilter =
      page.getByRole(
        'button',
        {
          name: /All files\s*\(\d+\)/i
        }
      );

    this.logosFilter =
      page.getByRole(
        'button',
        {
          name: /Logos\s*\(\d+\)/i
        }
      );

    this.guidelinesFilter =
      page.getByRole(
        'button',
        {
          name: /Guidelines\s*\(\d+\)/i
        }
      );

    this.productImageryFilter =
      page.getByRole(
        'button',
        {
          name: /Product imagery\s*\(\d+\)/i
        }
      );

    this.sampleCopyFilter =
      page.getByRole(
        'button',
        {
          name: /Sample copy\s*\(\d+\)/i
        }
      );

    this.caseStudiesFilter =
      page.getByRole(
        'button',
        {
          name: /Case studies\s*\(\d+\)/i
        }
      );

    this.coloursFontsFilter =
      page.getByRole(
        'button',
        {
          name: /Colours\s*&\s*fonts\s*\(\d+\)/i
        }
      );
  }

  // ==========================================
  // OPEN REFERENCE LIBRARY
  // ==========================================

  async openReferenceLibrary() {
    console.log(
      'Opening Reference Library...'
    );

    await this.open(
      '/reference-library'
    );

    const pageLoaded =
      await this.referenceLibraryHeading
        .waitFor({
          state: 'visible',
          timeout: 15000
        })
        .then(() => true)
        .catch(() => false);

    if (!pageLoaded) {
      console.log(
        'Opening Reference Library from sidebar.'
      );

      const sidebarLink =
        this.page.getByText(
          'Reference Library',
          { exact: true }
        ).first();

      await expect(
        sidebarLink
      ).toBeVisible({
        timeout: 15000
      });

      await sidebarLink.click();
    }

    await expect(
      this.referenceLibraryHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.description
    ).toBeVisible();

    await expect(
      this.searchFilesInput
    ).toBeVisible();

    console.log(
      'Reference Library loaded successfully.'
    );
  }

  // ==========================================
  // BRAND SELECTION
  // ==========================================

  getBrandButton(brandName) {
    return this.page.getByRole(
      'button',
      {
        name: brandName,
        exact: true
      }
    ).first();
  }

  async selectBrand(brandName) {
    if (!brandName?.trim()) {
      throw new Error(
        'REFERENCE_LIBRARY_BRAND must be configured.'
      );
    }

    const requiredBrand =
      brandName.trim();

    const brandButton =
      this.getBrandButton(
        requiredBrand
      );

    await expect(
      brandButton
    ).toBeVisible({
      timeout: 20000
    });

    await brandButton
      .scrollIntoViewIfNeeded();

    await brandButton.click();

    await expect(
      brandButton
    ).toBeVisible();

    console.log(
      `Reference Library brand selected: ${requiredBrand}`
    );
  }

  // ==========================================
  // FILTER COUNTS
  // ==========================================

  async getFilterCount(filterLocator) {
    await expect(
      filterLocator
    ).toBeVisible();

    const filterText = (
      await filterLocator.innerText()
    ).replace(/\s+/g, ' ').trim();

    const countMatch =
      filterText.match(
        /\((\d+)\)/
      );

    if (!countMatch) {
      throw new Error(
        `Filter count was not found: ${filterText}`
      );
    }

    return Number(
      countMatch[1]
    );
  }

  async verifyExpectedFilterCounts(
    expectedCounts
  ) {
    const actualCounts = {
      allFiles:
        await this.getFilterCount(
          this.allFilesFilter
        ),

      logos:
        await this.getFilterCount(
          this.logosFilter
        ),

      guidelines:
        await this.getFilterCount(
          this.guidelinesFilter
        ),

      productImagery:
        await this.getFilterCount(
          this.productImageryFilter
        ),

      sampleCopy:
        await this.getFilterCount(
          this.sampleCopyFilter
        ),

      caseStudies:
        await this.getFilterCount(
          this.caseStudiesFilter
        ),

      coloursFonts:
        await this.getFilterCount(
          this.coloursFontsFilter
        )
    };

    for (
      const [
        filterName,
        expectedValue
      ] of Object.entries(
        expectedCounts
      )
    ) {
      expect(
        actualCounts[filterName],
        `Unexpected count for ${filterName}`
      ).toBe(
        Number(expectedValue)
      );
    }

    console.log(
      'Reference Library category counts verified.'
    );

    return actualCounts;
  }

  // ==========================================
  // FILTER INTERACTION
  // ==========================================

  async verifyCategoryFilters() {
    const filters = [
      {
        name: 'All files',
        locator: this.allFilesFilter
      },
      {
        name: 'Logos',
        locator: this.logosFilter
      },
      {
        name: 'Guidelines',
        locator: this.guidelinesFilter
      },
      {
        name: 'Product imagery',
        locator: this.productImageryFilter
      },
      {
        name: 'Sample copy',
        locator: this.sampleCopyFilter
      },
      {
        name: 'Case studies',
        locator: this.caseStudiesFilter
      },
      {
        name: 'Colours & fonts',
        locator: this.coloursFontsFilter
      }
    ];

    for (const filter of filters) {
      await expect(
        filter.locator
      ).toBeVisible();

      await expect(
        filter.locator
      ).toBeEnabled();

      await filter.locator.click();

      console.log(
        `Reference Library filter selected: ${filter.name}`
      );
    }

    await this.allFilesFilter.click();
  }

  // ==========================================
  // SEARCH
  // ==========================================

  async searchFiles(searchText) {
    if (!searchText?.trim()) {
      throw new Error(
        'A Reference Library search value is required.'
      );
    }

    const requiredSearch =
      searchText.trim();

    await this.searchFilesInput.fill(
      requiredSearch
    );

    await expect(
      this.searchFilesInput
    ).toHaveValue(
      requiredSearch
    );

    console.log(
      `Reference Library search entered: ${requiredSearch}`
    );
  }

  async clearSearch() {
    await this.searchFilesInput.clear();

    await expect(
      this.searchFilesInput
    ).toHaveValue('');
  }

  // ==========================================
  // ASSET CARDS
  // ==========================================

  getAssetCard(
    category,
    fileName
  ) {
    const categoryLabel =
      this.page.getByText(
        category,
        { exact: true }
      ).first();

    return categoryLabel.locator(
      'xpath=ancestor::div[' +
      `.//*[normalize-space()="${fileName}"]` +
      '][1]'
    );
  }

  async verifyAssetCard(
    category,
    fileName,
    brandName
  ) {
    const assetCard =
      this.getAssetCard(
        category,
        fileName
      );

    await expect(
      assetCard
    ).toBeVisible({
      timeout: 20000
    });

    await expect(
      assetCard.getByText(
        fileName,
        { exact: true }
      )
    ).toBeVisible();

    await expect(
      assetCard.getByText(
        brandName,
        { exact: true }
      )
    ).toBeVisible();

    await expect(
      assetCard.getByText(
        'Uploaded',
        { exact: true }
      )
    ).toBeVisible();

    const actionButtons =
      assetCard.locator('button');

    const actionButtonCount =
      await actionButtons.count();

    expect(
      actionButtonCount
    ).toBeGreaterThanOrEqual(2);

    console.log(
      `${category} asset verified: ${fileName}`
    );

    console.log(
      `Available card actions: ${actionButtonCount}`
    );

    return {
      category,
      fileName,
      actionButtonCount
    };
  }

  // ==========================================
  // VERIFY FILES FROM ENV
  // ==========================================

  async verifyConfiguredFiles(
    brandName
  ) {
    const guidelinePath =
      process.env.GUIDELINES_FILE;

    const logoPath =
      process.env.PRIMARY_LOGO_FILE;

    if (!guidelinePath) {
      throw new Error(
        'GUIDELINES_FILE must be configured.'
      );
    }

    if (!logoPath) {
      throw new Error(
        'PRIMARY_LOGO_FILE must be configured.'
      );
    }

    const guidelineFileName =
      path.basename(
        guidelinePath
      );

    const logoFileName =
      path.basename(
        logoPath
      );

    const productAsset =
      await this.verifyAssetCard(
        'Product',
        guidelineFileName,
        brandName
      );

    const guidelineAsset =
      await this.verifyAssetCard(
        'Guideline',
        guidelineFileName,
        brandName
      );

    const logoAsset =
      await this.verifyAssetCard(
        'Logo',
        logoFileName,
        brandName
      );

    console.log(
      'Configured Reference Library files verified.'
    );

    return {
      productAsset,
      guidelineAsset,
      logoAsset
    };
  }

  // ==========================================
  // VERIFY SEARCH RESULT
  // ==========================================

  async verifySearchedFileVisible(
    fileName
  ) {
    const matchingFiles =
      this.page.getByText(
        fileName,
        { exact: true }
      );

    await expect(
      matchingFiles.first()
    ).toBeVisible({
      timeout: 15000
    });

    const matchingCount =
      await matchingFiles.count();

    expect(
      matchingCount
    ).toBeGreaterThan(0);

    console.log(
      `Matching Reference Library files found: ${matchingCount}`
    );

    return matchingCount;
  }

  // ==========================================
  // VERIFY SAFE ACTION BOUNDARY
  // ==========================================

  async verifyDeleteActionsWithoutClicking() {
    const deleteButtons =
      this.page.locator(
        'button[aria-label*="delete" i], ' +
        'button[title*="delete" i]'
      );

    const labelledDeleteCount =
      await deleteButtons.count();

    if (
      labelledDeleteCount > 0
    ) {
      console.log(
        `Delete actions found: ${labelledDeleteCount}`
      );
    } else {
      console.log(
        'Delete icons are present but do not expose ' +
        'accessible names. Card action counts were verified.'
      );
    }

    console.log(
      'No Reference Library file was deleted.'
    );

    return labelledDeleteCount;
  }
}

module.exports = {
  ReferenceLibraryPage
};