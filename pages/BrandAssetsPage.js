const {
  expect
} = require('@playwright/test');

const {
  BasePage
} = require('./BasePage');

class BrandAssetsPage extends BasePage {
  constructor(page) {
    super(page);

    // ==========================================
    // BRAND ASSETS LIBRARY
    // ==========================================

    this.brandAssetsHeading = page
      .getByText(
        'Brand Assets',
        { exact: true }
      )
      .last();

    this.brandAssetsDescription =
      page.getByText(
        /Mavic kit creatives for the selected brand/i
      );

    this.generateNewButton =
      page.getByRole(
        'button',
        {
          name: /Generate new/i
        }
      ).first();

    this.searchGeneratedInput =
      page.getByPlaceholder(
        'Search generated...',
        { exact: true }
      );

    this.allGeneratedFilter =
      page.getByRole(
        'button',
        {
          name: /All generated\s*\(\d+\)/i
        }
      );

    this.creativesFilter =
      page.getByRole(
        'button',
        {
          name: /Creatives\s*\(\d+\)/i
        }
      );

    this.copyFilter =
      page.getByRole(
        'button',
        {
          name: /Copy\s*\(\d+\)/i
        }
      );

    this.approvedFilter =
      page.getByRole(
        'button',
        {
          name: /Approved\s*\(\d+\)/i
        }
      );

    this.groupByStatusText =
      page.getByText(
        'Group by status',
        { exact: true }
      );

    this.emptyGenerateCard =
      page.getByText(
        'Opens Brand Lab',
        { exact: true }
      );

    // ==========================================
    // GENERATE CREATIVE KIT
    // ==========================================
   this.generateCreativeKitHeading =
  page.locator('p')
    .filter({
      hasText:
        /^Generate creative kit$/
    })
    .first();

this.creativeBriefTitle =
  page.getByText(
    'Creative brief',
    { exact: true }
  ).first();

this.creativeBriefStep =
  page.getByText(
    /Step 1 of 2\s*[—-]\s*Creative brief/i
  ).first();

this.embeddedStudioTitle =
  page.getByText(
    'Generate creatives in the embedded studio',
    { exact: true }
  ).first();

this.generatedAssetsTitle =
  page.getByText(
    'Generated assets',
    { exact: true }
  ).first();

this.generatedAssetsDescription =
  page.getByText(
    /All saved Brand Lab images across brands/i
  ).first();

this.noGeneratedAssetsMessage =
  page.getByText(
    /No saved Brand Lab images yet/i
  ).first();

this.refreshButton =
  page.getByRole(
    'button',
    {
      name: /Refresh/i
    }
  ).first();

this.cancelButton =
  page.getByRole(
    'button',
    {
      name: /Cancel/i
    }
  ).first();

this.generateCreativeKitButton =
  page.getByRole(
    'button',
    {
      name: 'Generate creative kit',
      exact: true
    }
  ).first();

    this.embeddedStudioFrame =
      page.locator('iframe').first();

    
    // ==========================================
// KIT REVIEW & PUSH
// ==========================================

this.reviewCreativeKitHeading =
  page.getByText(
    'Review your creative kit',
    { exact: true }
  ).first();

this.kitReviewStep =
  page.getByText(
    /Step 2 of 2\s*[—-]\s*Kit review/i
  ).first();

this.channelCreativesTitle =
  page.getByText(
    'Channel creatives',
    { exact: true }
  ).first();

this.noKitYetStatus =
  page.getByText(
    'No kit yet',
    { exact: true }
  ).first();

this.noCreativesMessage =
  page.getByText(
    /No creatives in the kit yet/i
  ).first();

this.approvalsTitle =
  page.getByText(
    'Approvals',
    { exact: true }
  ).first();

this.nothingToApproveMessage =
  page.getByText(
    'Nothing to approve yet.',
    { exact: true }
  ).first();

this.approveAtLeastOneMessage =
  page.getByText(
    /Approve at least one creative to push to a campaign/i
  ).first();

this.approvedProgressText =
  page.getByText(
    /\d+\s+of\s+\d+\s+approved/i
  ).first();

this.approveAllRemainingButton =
  page.getByRole(
    'button',
    {
      name: /Approve all remaining/i
    }
  ).first();

this.pushApprovedCreativesButton =
  page.getByRole(
    'button',
    {
      name:
        /Push\s+\d+\s+approved creatives/i
    }
  ).first();

this.kitReviewBackButton =
  page.getByRole(
    'button',
    {
      name: 'Back',
      exact: true
    }
  ).last();
  }

  // ==========================================
  // OPEN BRAND ASSETS
  // ==========================================

  async openBrandAssets() {
    console.log(
      'Opening Brand Assets...'
    );

    await this.open('/brand-assets');

    const pageLoaded =
      await this.brandAssetsHeading
        .waitFor({
          state: 'visible',
          timeout: 15000
        })
        .then(() => true)
        .catch(() => false);

    if (!pageLoaded) {
      console.log(
        'Direct Brand Assets navigation did not load. ' +
        'Opening from the sidebar.'
      );

      const sidebarLink =
        this.page.getByText(
          'Brand Assets',
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
      this.brandAssetsHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.brandAssetsDescription
    ).toBeVisible();

    await expect(
      this.generateNewButton
    ).toBeVisible();

    console.log(
      'Brand Assets page loaded successfully.'
    );
  }

  // ==========================================
  // VERIFY LIBRARY CONTROLS
  // ==========================================

  async verifyLibraryControls() {
    await expect(
      this.allGeneratedFilter
    ).toBeVisible();

    await expect(
      this.creativesFilter
    ).toBeVisible();

    await expect(
      this.copyFilter
    ).toBeVisible();

    await expect(
      this.approvedFilter
    ).toBeVisible();

    await expect(
      this.searchGeneratedInput
    ).toBeVisible();

    await expect(
      this.groupByStatusText
    ).toBeVisible();

    console.log(
      'Brand Assets filters and search are visible.'
    );
  }

  // ==========================================
  // SELECT BRAND
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
        'BRAND_ASSET_BRAND must be configured.'
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
      `Brand Assets brand selected: ${requiredBrand}`
    );
  }

  // ==========================================
  // VERIFY FILTERS
  // ==========================================

  async verifyAssetFilters() {
    const filters = [
      {
        name: 'All generated',
        locator: this.allGeneratedFilter
      },
      {
        name: 'Creatives',
        locator: this.creativesFilter
      },
      {
        name: 'Copy',
        locator: this.copyFilter
      },
      {
        name: 'Approved',
        locator: this.approvedFilter
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
        `Brand Assets filter selected: ${filter.name}`
      );
    }

    await this.allGeneratedFilter.click();
  }

  // ==========================================
  // SEARCH GENERATED ASSETS
  // ==========================================

  async verifyAssetSearch(searchText) {
    if (!searchText?.trim()) {
      throw new Error(
        'A Brand Assets search value is required.'
      );
    }

    const requiredSearch =
      searchText.trim();

    await this.searchGeneratedInput.fill(
      requiredSearch
    );

    await expect(
      this.searchGeneratedInput
    ).toHaveValue(
      requiredSearch
    );

    console.log(
      `Brand Assets search entered: ${requiredSearch}`
    );

    await this.searchGeneratedInput.clear();

    await expect(
      this.searchGeneratedInput
    ).toHaveValue('');
  }

  // ==========================================
  // VERIFY EMPTY OR POPULATED STATE
  // ==========================================

  async verifyAssetLibraryState() {
    const assetCards =
      this.page.locator(
        '[data-testid*="asset"], ' +
        '[data-testid*="creative"]'
      );

    const emptyCardVisible =
      await this.emptyGenerateCard
        .isVisible()
        .catch(() => false);

    const assetCardCount =
      await assetCards.count();

    if (emptyCardVisible) {
      console.log(
        'No generated assets are available for the selected brand.'
      );

      await expect(
        this.emptyGenerateCard
      ).toBeVisible();

      return {
        emptyState: true,
        assetCount: 0
      };
    }

    console.log(
      `Generated asset elements found: ${assetCardCount}`
    );

    return {
      emptyState: assetCardCount === 0,
      assetCount: assetCardCount
    };
  }

  // ==========================================
  // OPEN GENERATE CREATIVE KIT
  // ==========================================

  async openGenerateCreativeKit() {
    await this.generateNewButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.generateNewButton
    ).toBeVisible();

    await expect(
      this.generateNewButton
    ).toBeEnabled();

    await this.generateNewButton.click();

    await this.page.waitForURL(
      url =>
        url.pathname.includes(
          '/brand-lab/generate'
        ),
      {
        timeout: 30000,
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      this.generateCreativeKitHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.creativeBriefTitle
    ).toBeVisible();

    console.log(
      'Generate Creative Kit page opened.'
    );
  }

  // ==========================================
  // CUSTOM CREATIVE-BRIEF DROPDOWN
  // ==========================================

  getBriefFieldLabel(labelText) {
    return this.page
      .locator(
        'label, p, div'
      )
      .filter({
        hasText: new RegExp(
          `^\\s*${labelText}\\s*\\*?\\s*$`,
          'i'
        )
      })
      .first();
  }

  async getBriefFieldTrigger(labelText) {
    const label =
      this.getBriefFieldLabel(
        labelText
      );

    await expect(
      label
    ).toBeVisible({
      timeout: 20000
    });

    const trigger =
      label.locator(
        'xpath=following::*[' +
        '@role="combobox" or ' +
        'self::button' +
        '][1]'
      );

    await expect(
      trigger
    ).toBeVisible({
      timeout: 15000
    });

    return trigger;
  }

  async selectBriefOption(
    labelText,
    optionName
  ) {
    if (!optionName?.trim()) {
      throw new Error(
        `A value is required for ${labelText}.`
      );
    }

    const requiredOption =
      optionName.trim();

    const trigger =
      await this.getBriefFieldTrigger(
        labelText
      );

    const currentValue = (
      await trigger.innerText()
    ).replace(/\s+/g, ' ').trim();

    if (
      currentValue.toLowerCase() ===
      requiredOption.toLowerCase()
    ) {
      console.log(
        `${labelText}: ${requiredOption} is already selected.`
      );

      return;
    }

    await trigger.click();

    const roleOption =
      this.page.getByRole(
        'option',
        {
          name: requiredOption,
          exact: true
        }
      );

    if (
      await roleOption
        .isVisible()
        .catch(() => false)
    ) {
      await roleOption.click();
    } else {
      const textOption =
        this.page.getByText(
          requiredOption,
          { exact: true }
        ).last();

      await expect(
        textOption
      ).toBeVisible({
        timeout: 15000
      });

      await textOption.click();
    }

    await expect(
      trigger
    ).toContainText(
      requiredOption
    );

    console.log(
      `${labelText} selected: ${requiredOption}`
    );
  }

  // ==========================================
  // COMPLETE CREATIVE BRIEF
  // ==========================================

  async configureCreativeBrief(data) {
    await this.selectBriefOption(
      'OEM BRAND',
      data.brand
    );

    await this.selectBriefOption(
      'BRAND PRODUCT TO PROMOTE',
      data.product
    );

    await this.selectBriefOption(
      'CAMPAIGN OBJECTIVE',
      data.objective
    );

    await this.selectBriefOption(
      'TARGET PERSONA',
      data.persona
    );

    console.log(
      'Creative brief selections completed.'
    );
  }

  // ==========================================
  // VERIFY CREATIVE BRIEF VALUES
  // ==========================================

  async verifyCreativeBrief(data) {
    const values = [
      data.brand,
      data.product,
      data.objective,
      data.persona
    ];

    for (const value of values) {
      await expect(
        this.page.getByText(
          value,
          { exact: true }
        ).first()
      ).toBeVisible({
        timeout: 20000
      });
    }

    await expect(
      this.creativeBriefTitle
    ).toBeVisible();

    console.log(
      'Creative brief values verified.'
    );
  }

  // ==========================================
  // VERIFY EMBEDDED STUDIO
  // ==========================================

  async verifyEmbeddedStudio() {
    await this.embeddedStudioTitle
      .scrollIntoViewIfNeeded();

    await expect(
      this.embeddedStudioTitle
    ).toBeVisible();

    const iframeVisible =
      await this.embeddedStudioFrame
        .isVisible()
        .catch(() => false);

    if (iframeVisible) {
      console.log(
        'Embedded creative studio iframe is visible.'
      );
    } else {
      /*
       * Some deployments render the studio through
       * an embedded web component instead of an iframe.
       */
      const studioContent =
        this.page.getByText(
          /What would you like to create\?/i
        );

      await expect(
        studioContent
      ).toBeVisible({
        timeout: 30000
      });

      console.log(
        'Embedded creative studio content is visible.'
      );
    }
  }

  // ==========================================
  // VERIFY GENERATED ASSETS SECTION
  // ==========================================

  async verifyGeneratedAssetsSection() {
    await this.generatedAssetsTitle
      .scrollIntoViewIfNeeded();

    await expect(
      this.generatedAssetsTitle
    ).toBeVisible();

    await expect(
      this.generatedAssetsDescription
    ).toBeVisible();

    await expect(
      this.refreshButton
    ).toBeVisible();

    await expect(
      this.refreshButton
    ).toBeEnabled();

    const emptyState =
      await this.noGeneratedAssetsMessage
        .isVisible()
        .catch(() => false);

    if (emptyState) {
      console.log(
        'No saved Brand Lab images are currently available.'
      );
    } else {
      console.log(
        'Saved Brand Lab generated assets are available.'
      );
    }

    return {
      emptyState
    };
  }

  // ==========================================
  // VERIFY FINAL ACTIONS
  // ==========================================

  async verifyCreativeKitActions() {
    await this.generateCreativeKitButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.cancelButton
    ).toBeVisible();

    await expect(
      this.generateCreativeKitButton
    ).toBeVisible();

    await expect(
      this.generateCreativeKitButton
    ).toBeEnabled();

    console.log(
      'Generate Creative Kit action is available.'
    );

    console.log(
      'Generate Creative Kit was intentionally not clicked.'
    );
  }


  // ==========================================
// OPEN KIT REVIEW & PUSH
// ==========================================

async openKitReviewAndPush() {
  await this.generateCreativeKitButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.generateCreativeKitButton
  ).toBeVisible({
    timeout: 20000
  });

  await expect(
    this.generateCreativeKitButton
  ).toBeEnabled();

  console.log(
    'Opening Kit review & push...'
  );

  await this.generateCreativeKitButton.click();

  await expect(
    this.reviewCreativeKitHeading
  ).toBeVisible({
    timeout: 30000
  });

  await expect(
    this.kitReviewStep
  ).toBeVisible({
    timeout: 20000
  });

  console.log(
    'Kit review & push page opened.'
  );

  console.log(
    `Current URL: ${this.page.url()}`
  );
}

// ==========================================
// GET REVIEW SUMMARY VALUE
// ==========================================

async getReviewSummaryValue(labelText) {
  const label =
    this.page.getByText(
      labelText,
      { exact: true }
    ).first();

  await expect(
    label
  ).toBeVisible();

  const summaryCard =
    label.locator(
      'xpath=ancestor::div[1]'
    );

  const summaryText = (
    await summaryCard.innerText()
  ).replace(/\s+/g, ' ').trim();

  const valueMatch =
    summaryText.match(/\d+/);

  if (!valueMatch) {
    throw new Error(
      `Summary count was not found for: ${labelText}. ` +
      `Displayed text: ${summaryText}`
    );
  }

  const value =
    Number(valueMatch[0]);

  expect(
    Number.isNaN(value)
  ).toBeFalsy();

  console.log(
    `${labelText}: ${value}`
  );

  return value;
}

// ==========================================
// VERIFY KIT REVIEW PAGE
// ==========================================

async verifyKitReviewPage() {
  await expect(
    this.reviewCreativeKitHeading
  ).toBeVisible({
    timeout: 30000
  });

  await expect(
    this.kitReviewStep
  ).toBeVisible();

  await expect(
    this.channelCreativesTitle
  ).toBeVisible();

  await expect(
    this.approvalsTitle
  ).toBeVisible();

  const kitCreatives =
    await this.getReviewSummaryValue(
      'Kit creatives'
    );

  const approved =
    await this.getReviewSummaryValue(
      'Approved'
    );

  const pendingApproval =
    await this.getReviewSummaryValue(
      'Pending approval'
    );

  console.log(
    'Kit review summary verified.'
  );

  return {
    kitCreatives,
    approved,
    pendingApproval
  };
}

// ==========================================
// VERIFY EMPTY KIT STATE
// ==========================================

async verifyEmptyKitState() {
  const summary =
    await this.verifyKitReviewPage();

  expect(
    summary.kitCreatives
  ).toBe(0);

  expect(
    summary.approved
  ).toBe(0);

  expect(
    summary.pendingApproval
  ).toBe(0);

  await expect(
    this.noKitYetStatus
  ).toBeVisible();

  await expect(
    this.noCreativesMessage
  ).toBeVisible();

  await expect(
    this.nothingToApproveMessage
  ).toBeVisible();

  await expect(
    this.approveAtLeastOneMessage
  ).toBeVisible();

  await expect(
    this.approvedProgressText
  ).toContainText(
    '0 of 0 approved'
  );

  await expect(
    this.approveAllRemainingButton
  ).toBeVisible();

  await expect(
    this.pushApprovedCreativesButton
  ).toBeVisible();

  await expect(
    this.pushApprovedCreativesButton
  ).toContainText(
    'Push 0 approved creatives'
  );

  console.log(
    'Empty creative-kit review state verified.'
  );

  console.log(
    'No approval or campaign push was performed.'
  );

  return summary;
}

// ==========================================
// RETURN TO CREATIVE BRIEF
// ==========================================

async returnToCreativeBrief() {
  await this.kitReviewBackButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.kitReviewBackButton
  ).toBeVisible();

  await this.kitReviewBackButton.click();

  await expect(
    this.creativeBriefTitle
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    'Returned to the Creative Brief page.'
  );
}
}

module.exports = {
  BrandAssetsPage
};