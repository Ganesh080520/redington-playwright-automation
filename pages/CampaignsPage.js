const {
  expect
} = require('@playwright/test');

const {
  BasePage
} = require('./BasePage');

class CampaignsPage extends BasePage {
  constructor(page) {
    super(page);

    // ==========================================
    // CAMPAIGNS DASHBOARD
    // ==========================================

    this.campaignsTitle = page
      .getByText(
        'Campaigns',
        { exact: true }
      )
      .last();

    this.createCampaignButton =
      page.getByRole(
        'button',
        {
          name: /Create campaign/i
        }
      );

    // ==========================================
    // CAMPAIGN SETUP
    // ==========================================

    this.setupTitle = page.getByText(
      'Set up the campaign',
      { exact: true }
    );

    this.campaignDetailsTitle =
      page.getByText(
        'Campaign details',
        { exact: true }
      );

    this.campaignNameInput =
      page.getByPlaceholder(
        'Enter campaign name',
        { exact: true }
      );

    // ==========================================
    // CAMPAIGN FIELD LABELS
    // ==========================================

    this.brandLabel = page
      .locator('p')
      .filter({
        hasText:
          /^\s*Brand\s*\*?\s*$/i
      })
      .first();

    this.productLabel = page
      .locator('p')
      .filter({
        hasText:
          /^\s*Brand product to promote\s*\*?\s*$/i
      })
      .first();

    this.objectiveLabel = page
      .locator('p')
      .filter({
        hasText:
          /^\s*Campaign objective\s*\*?\s*$/i
      })
      .first();

    this.personaLabel = page
      .locator('p')
      .filter({
        hasText:
          /^\s*Target persona\s*\*?\s*$/i
      })
      .first();

    this.durationLabel = page
      .locator('p')
      .filter({
        hasText:
          /^\s*Campaign duration\s*\*?\s*$/i
      })
      .first();

    this.mdfBudgetTitle = page
      .locator('p')
      .filter({
        hasText:
          /^\s*MDF budget\s*$/i
      })
      .first();

    // ==========================================
    // GEOGRAPHY
    // ==========================================

    this.geographyInput =
      page.getByPlaceholder(
        'Enter geography',
        { exact: true }
      );

    /*
     * Retained for compatibility with older
     * Campaign Setup versions. The current UI
     * calculates contacts from the audience.
     */
    this.contactsInput = page
      .getByPlaceholder(
        /number of contacts|contacts/i
      )
      .or(
        page.getByLabel(
          /contacts in this geography|number of contacts/i
        )
      )
      .or(
        page.locator(
          'input[name*="contact" i]'
        )
      )
      .first();

    // ==========================================
    // DURATION AND BUDGET
    // ==========================================

    this.durationButton =
      page.getByRole(
        'button',
        {
          name:
            /Pick start and end dates/i
        }
      );

    this.mdfBudgetSlider =
      page.getByRole('slider').first();

    // ==========================================
    // AUDIENCE
    // ==========================================

    this.audienceTitle = page
      .getByText(
        /Choose the audience|Choose audience|Select audience|Campaign audience/i
      )
      .first();

    this.buildAudienceButton =
      page.getByRole(
        'button',
        {
          name:
            /Build a new audience/i
        }
      );

    this.audienceSearchInput = page
      .locator(
        'input[placeholder*="Search saved lists"]'
      )
      .first();

    this.audienceEmptyMessage = page
      .getByText(
        /No audiences.*yet|No saved audiences|No audiences found/i
      )
      .first();

    // ==========================================
    // CAMPAIGN ASSETS
    // ==========================================

    this.campaignAssetsTitle =
      page.getByText(
        'Campaign assets',
        { exact: true }
      )
      .first();

    this.brandLabImagesTitle =
      page.getByText(
        'Brand Lab images',
        { exact: true }
      )
      .first();

    this.brandFilesTitle =
      page.getByText(
        'Brand files',
        { exact: true }
      )
      .first();

    this.addBrandLabImage = page
      .getByText(
        /Add Brand Lab image|Add Brand Lab creative|Add creative|Select creative/i
      )
      .first();

    this.addBrandFileAction = page
      .getByText(
        'Add brand file',
        { exact: true }
      )
      .first();

    // Compatibility alias.
    this.addBrandFile =
      this.addBrandFileAction;

    this.addBrandFileDialog = page
      .getByRole('dialog')
      .filter({
        hasText: 'Add brand file'
      });

    this.removeAssetButtons =
      page.getByRole(
        'button',
        {
          name: 'Remove',
          exact: true
        }
      );

    this.noKitCreativesMessage =
      page.getByText(
        /No approved Brand Lab creatives|No kit creatives|No creatives|No assets available|No campaign assets/i
      ).first();

    this.generateNewButton = page
      .getByRole(
        'button',
        {
          name:
            /Generate new|Generate creative/i
        }
      )
      .first();

    // ==========================================
    // NAVIGATION
    // ==========================================

    this.continueButton =
      page.getByRole(
        'button',
        {
          name:
            /Continue to channels/i
        }
      );

    // ==========================================
    // CHANNELS AND BUDGET
    // ==========================================

    this.channelsHeading =
      page.getByText(
        'Channels & budget',
        { exact: true }
      );

    this.saveAndContinueButton =
  page.getByRole(
    'button',
    {
      name: /Save\s*&\s*continue/i
    }
  );

    this.aiRecommendationTitle =
      page.getByText(
        'AI channel recommendation',
        { exact: true }
      );

    this.totalAllocationText =
      page.getByText(
        /^\s*100%\s+allocated/i
      );

    this.resetAiMixButton = page
      .getByRole(
        'button',
        {
          name: /Reset to AI mix/i
        }
      )
      .or(
        page.getByText(
          'Reset to AI mix',
          { exact: true }
        )
      );

    this.projectedOutcomeTitle =
      page.getByText(
        'Projected outcome',
        { exact: true }
      );

    this.estimatedLeadsLabel =
      page.getByText(
        'estimated leads',
        { exact: true }
      );

    this.estimatedSqlsLabel =
      page.getByText(
        'estimated SQLs',
        { exact: true }
      );

    this.blendedCplLabel =
      page.getByText(
        'blended CPL',
        { exact: true }
      );

    this.budgetAllocatedLabel =
      page.getByText(
        'budget allocated',
        { exact: true }
      );

    // this.launchCampaignButton =
    //   page.getByRole(
    //     'button',
    //     {
    //       name:
    //         /Launch campaign/i
    //     }
    //   );

    this.channelsBackButton =
      page.getByRole(
        'button',
        {
          name: 'Back',
          exact: true
        }
      );
  }

  // ==========================================
  // OPEN CAMPAIGNS
  // ==========================================

  async openCampaigns() {
    console.log(
      'Opening Campaigns dashboard...'
    );

    await this.open('/campaigns');

    await expect(
      this.campaignsTitle
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.createCampaignButton
    ).toBeVisible();

    console.log(
      'Campaigns dashboard loaded.'
    );
  }

  // ==========================================
  // START CAMPAIGN
  // ==========================================

  async startCampaign() {
    await this.createCampaignButton.click();

    await this.page.waitForURL(
      url =>
        url.pathname.includes(
          '/campaigns/setup'
        ),
      {
        timeout: 30000
      }
    );

    await expect(
      this.setupTitle
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.campaignDetailsTitle
    ).toBeVisible();

    await expect(
      this.campaignNameInput
    ).toBeVisible();

    console.log(
      'Campaign Setup opened.'
    );
  }

  // ==========================================
  // CAMPAIGN DETAILS
  // ==========================================

  async enterCampaignName(name) {
    if (!name?.trim()) {
      throw new Error(
        'CAMPAIGN_NAME must be configured.'
      );
    }

    const requiredName = name.trim();

    await this.campaignNameInput.fill(
      requiredName
    );

    await expect(
      this.campaignNameInput
    ).toHaveValue(requiredName);
  }

  async selectCampaignDropdown(
    label,
    optionName
  ) {
    if (!optionName?.trim()) {
      throw new Error(
        'A campaign dropdown value is required.'
      );
    }

    const option = optionName.trim();

    await label.scrollIntoViewIfNeeded();

    await expect(
      label
    ).toBeVisible({
      timeout: 20000
    });

    const trigger = label.locator(
      'xpath=following::button[1]'
    );

    await expect(
      trigger
    ).toBeVisible({
      timeout: 15000
    });

    const currentValue = (
      await trigger.innerText()
    ).trim();

    if (
      currentValue.toLowerCase() ===
      option.toLowerCase()
    ) {
      console.log(
        `${option} is already selected.`
      );

      return;
    }

    await trigger.click();

    const roleOption =
      this.page.getByRole(
        'option',
        {
          name: option,
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
      const buttonOption =
        this.page.getByRole(
          'button',
          {
            name: option,
            exact: true
          }
        ).last();

      await expect(
        buttonOption
      ).toBeVisible({
        timeout: 15000
      });

      await buttonOption.click();
    }

    await expect(
      trigger
    ).toContainText(option);

    console.log(
      `Selected campaign value: ${option}`
    );
  }

  async fillCampaignDetails(data) {
    await this.enterCampaignName(
      data.name
    );

    await this.selectCampaignDropdown(
      this.brandLabel,
      data.brand
    );

    await this.selectCampaignDropdown(
      this.productLabel,
      data.product
    );

    await this.selectCampaignDropdown(
      this.objectiveLabel,
      data.objective
    );

    await this.selectCampaignDropdown(
      this.personaLabel,
      data.persona
    );

    console.log(
      'Campaign details completed.'
    );
  }

  async verifySelectedCampaignDetails(
    data
  ) {
    await expect(
      this.campaignNameInput
    ).toHaveValue(data.name);

    await expect(
      this.brandLabel.locator(
        'xpath=following::button[1]'
      )
    ).toContainText(data.brand);

    await expect(
      this.productLabel.locator(
        'xpath=following::button[1]'
      )
    ).toContainText(data.product);

    await expect(
      this.objectiveLabel.locator(
        'xpath=following::button[1]'
      )
    ).toContainText(data.objective);

    await expect(
      this.personaLabel.locator(
        'xpath=following::button[1]'
      )
    ).toContainText(data.persona);
  }

  // ==========================================
  // GEOGRAPHY
  // ==========================================

  async enterGeographyAndContacts(
    geography,
    contacts
  ) {
    if (!geography?.trim()) {
      throw new Error(
        'CAMPAIGN_GEOGRAPHY must be configured.'
      );
    }

    const requiredGeography =
      geography.trim();

    await this.geographyInput
      .scrollIntoViewIfNeeded();

    await expect(
      this.geographyInput
    ).toBeVisible({
      timeout: 20000
    });

    await this.geographyInput.fill(
      requiredGeography
    );

    await expect(
      this.geographyInput
    ).toHaveValue(
      requiredGeography
    );

    console.log(
      `Geography entered: ${requiredGeography}`
    );

    const contactValue =
      String(contacts ?? '').trim();

    if (!contactValue) {
      console.log(
        'Contacts are calculated from the ' +
        'selected audience in the updated UI.'
      );

      return {
        geographyEntered: true,
        contactsEntered: false,
        contactsFieldAvailable: false
      };
    }

    if (!/^\d+$/.test(contactValue)) {
      throw new Error(
        'CAMPAIGN_CONTACTS must contain only numbers.'
      );
    }

    const available =
      await this.contactsInput
        .waitFor({
          state: 'visible',
          timeout: 5000
        })
        .then(() => true)
        .catch(() => false);

    if (!available) {
      console.log(
        'Contacts input is not available. ' +
        'Contacts will be derived from the audience.'
      );

      return {
        geographyEntered: true,
        contactsEntered: false,
        contactsFieldAvailable: false
      };
    }

    await this.contactsInput.fill(
      contactValue
    );

    await expect(
      this.contactsInput
    ).toHaveValue(contactValue);

    return {
      geographyEntered: true,
      contactsEntered: true,
      contactsFieldAvailable: true
    };
  }

  // ==========================================
  // CAMPAIGN DURATION
  // ==========================================

  formatCalendarDate(isoDate) {
    const parts = isoDate
      .split('-')
      .map(Number);

    if (
      parts.length !== 3 ||
      parts.some(Number.isNaN)
    ) {
      throw new Error(
        `Invalid date: ${isoDate}. ` +
        'Expected YYYY-MM-DD.'
      );
    }

    const [year, month, day] = parts;

    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

    if (Number.isNaN(date.getTime())) {
      throw new Error(
        `Invalid date: ${isoDate}`
      );
    }

    const monthName =
      new Intl.DateTimeFormat(
        'en-GB',
        {
          month: 'long',
          timeZone: 'UTC'
        }
      ).format(date);

    return `${day} ${monthName} ${year}`;
  }

  async findCalendarDateButton(isoDate) {
    const [year, month, day] =
      isoDate.split('-').map(Number);

    const date = new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    );

    const usMonth =
      new Intl.DateTimeFormat(
        'en-US',
        {
          month: 'long',
          timeZone: 'UTC'
        }
      ).format(date);

    const candidates = [
      this.page.locator(
        `button[data-date="${isoDate}"]`
      ),

      this.page.locator(
        `button[data-day="${isoDate}"]`
      ),

      this.page.getByRole(
        'button',
        {
          name:
            this.formatCalendarDate(
              isoDate
            ),
          exact: true
        }
      ),

      this.page.getByRole(
        'button',
        {
          name:
            `${usMonth} ${day}, ${year}`,
          exact: true
        }
      )
    ];

    for (const candidate of candidates) {
      const count =
        await candidate.count();

      for (
        let index = 0;
        index < count;
        index++
      ) {
        const dateButton =
          candidate.nth(index);

        if (
          await dateButton
            .isVisible()
            .catch(() => false)
        ) {
          return dateButton;
        }
      }
    }

    throw new Error(
      `Calendar date not found: ${isoDate}`
    );
  }

  async selectCampaignDuration(
    startDate,
    endDate
  ) {
    const startTimestamp =
      Date.parse(startDate);

    const endTimestamp =
      Date.parse(endDate);

    if (
      Number.isNaN(startTimestamp) ||
      Number.isNaN(endTimestamp)
    ) {
      throw new Error(
        'Campaign dates must use YYYY-MM-DD.'
      );
    }

    if (endTimestamp < startTimestamp) {
      throw new Error(
        'CAMPAIGN_END_DATE cannot precede ' +
        'CAMPAIGN_START_DATE.'
      );
    }

    await this.durationButton.click();

    const startButton =
      await this.findCalendarDateButton(
        startDate
      );

    await startButton.click();

    const endButton =
      await this.findCalendarDateButton(
        endDate
      );

    await endButton.click();

    await this.page.keyboard
      .press('Escape')
      .catch(() => {});

    console.log(
      `Campaign duration selected: ` +
      `${startDate} to ${endDate}`
    );
  }

  async verifyCampaignDuration() {
    const button =
      this.durationLabel.locator(
        'xpath=following::button[1]'
      );

    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).not.toContainText(
      /Pick start and end dates/i
    );

    return (
      await button.innerText()
    ).trim();
  }

  // ==========================================
  // MDF BUDGET
  // ==========================================

  async verifyMdfBudget(
    expected = '12.5'
  ) {
    await this.mdfBudgetSlider
      .scrollIntoViewIfNeeded();

    await expect(
      this.mdfBudgetSlider
    ).toBeVisible();

    await expect(
      this.mdfBudgetSlider
    ).toHaveAttribute(
      'aria-valuenow',
      String(expected)
    );
  }

  async setMdfBudgetUsingMouse(
    targetBudget
  ) {
    const target =
      Number(targetBudget);

    const minimum = Number(
      await this.mdfBudgetSlider
        .getAttribute('aria-valuemin')
    );

    const maximum = Number(
      await this.mdfBudgetSlider
        .getAttribute('aria-valuemax')
    );

    if (
      Number.isNaN(target) ||
      target < minimum ||
      target > maximum
    ) {
      throw new Error(
        `MDF target must be between ` +
        `${minimum} and ${maximum}.`
      );
    }

    const thumb =
      await this.mdfBudgetSlider
        .boundingBox();

    const sliderRoot =
      this.mdfBudgetSlider.locator(
        'xpath=ancestor::div[' +
        'contains(@class,"mantine-Slider-root")' +
        '][1]'
      );

    const track =
      await sliderRoot.boundingBox();

    if (!thumb || !track) {
      throw new Error(
        'MDF slider geometry could not ' +
        'be calculated.'
      );
    }

    const startX =
      thumb.x + thumb.width / 2;

    const y =
      thumb.y + thumb.height / 2;

    const ratio =
      (target - minimum) /
      (maximum - minimum);

    const targetX =
      track.x + track.width * ratio;

    await this.page.mouse.move(
      startX,
      y
    );

    await this.page.mouse.down();

    await this.page.mouse.move(
      targetX,
      y,
      {
        steps: 25
      }
    );

    await this.page.mouse.up();

    let current = Number(
      await this.mdfBudgetSlider
        .getAttribute('aria-valuenow')
    );

    const configuredStep = Number(
      await this.mdfBudgetSlider
        .getAttribute('step')
    );

    const step =
      configuredStep > 0
        ? configuredStep
        : 0.1;

    await this.mdfBudgetSlider.focus();

    let attempts = 0;

    while (
      Math.abs(current - target) >=
        step / 2 &&
      attempts < 500
    ) {
      await this.mdfBudgetSlider.press(
        current < target
          ? 'ArrowRight'
          : 'ArrowLeft'
      );

      current = Number(
        await this.mdfBudgetSlider
          .getAttribute(
            'aria-valuenow'
          )
      );

      attempts++;
    }

    await expect.poll(
      async () =>
        Number(
          await this.mdfBudgetSlider
            .getAttribute(
              'aria-valuenow'
            )
        ),
      {
        timeout: 10000
      }
    ).toBe(target);

    console.log(
      `MDF budget set to ₹${target} L`
    );
  }

  // ==========================================
  // CAMPAIGN ASSETS
  // ==========================================

  async openCampaignAssets() {
    await this.campaignAssetsTitle
      .scrollIntoViewIfNeeded();

    await expect(
      this.campaignAssetsTitle
    ).toBeVisible({
      timeout: 20000
    });

    const contentVisible =
      await this.brandFilesTitle
        .isVisible()
        .catch(() => false);

    if (contentVisible) {
      console.log(
        'Campaign Assets section is already expanded.'
      );

      return true;
    }

    const toggle =
      this.campaignAssetsTitle.locator(
        'xpath=following::button[1]'
      );

    if (
      await toggle
        .isVisible()
        .catch(() => false)
    ) {
      await toggle.click();
    } else {
      await this.campaignAssetsTitle.click();
    }

    await expect.poll(
      async () =>
        await this.brandFilesTitle
          .isVisible()
          .catch(() => false) ||
        await this.addBrandFileAction
          .isVisible()
          .catch(() => false) ||
        await this.generateNewButton
          .isVisible()
          .catch(() => false),
      {
        timeout: 15000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          'Waiting for Campaign Assets to expand'
      }
    ).toBeTruthy();

    console.log(
      'Campaign Assets section expanded.'
    );

    return true;
  }

  async getSelectedAssetCount() {
    const legacyLabels =
      this.page.getByText(
        /^\d+\s+assets?\s+(attached|selected)$/i
      );

    const legacyCount =
      await legacyLabels.count();

    for (
      let index = 0;
      index < legacyCount;
      index++
    ) {
      const text = (
        await legacyLabels
          .nth(index)
          .innerText()
      ).trim();

      const value = Number(
        text.match(/\d+/)?.[0]
      );

      if (!Number.isNaN(value)) {
        return value;
      }
    }

    /*
     * Updated UI displays one visible Remove
     * button for every attached asset card.
     */
    const removeCount =
      await this.removeAssetButtons.count();

    let visibleAssetCount = 0;

    for (
      let index = 0;
      index < removeCount;
      index++
    ) {
      const visible =
        await this.removeAssetButtons
          .nth(index)
          .isVisible()
          .catch(() => false);

      if (visible) {
        visibleAssetCount++;
      }
    }

    return visibleAssetCount;
  }

  async isBrandFileAttached(
    fileName
  ) {
    const selectedAssetCount =
      await this.getSelectedAssetCount();

    if (selectedAssetCount === 0) {
      return false;
    }

    const fileLabels =
      this.page.getByText(
        fileName,
        {
          exact: true
        }
      );

    const count =
      await fileLabels.count();

    for (
      let index = 0;
      index < count;
      index++
    ) {
      if (
        await fileLabels
          .nth(index)
          .isVisible()
          .catch(() => false)
      ) {
        return true;
      }
    }

    return false;
  }

  async attachBrandFile(
    fileName,
    category = 'guidelines'
  ) {
    if (!fileName?.trim()) {
      throw new Error(
        'A brand file name is required.'
      );
    }

    const requiredFileName =
      fileName.trim();

    const requiredCategory =
      category.trim();

    await this.openCampaignAssets();

    if (
      await this.isBrandFileAttached(
        requiredFileName
      )
    ) {
      console.log(
        `Brand file is already attached: ` +
        `${requiredFileName}`
      );

      return true;
    }

    await expect(
      this.addBrandFileAction
    ).toBeVisible({
      timeout: 20000
    });

    await this.addBrandFileAction.click();

    await expect(
      this.addBrandFileDialog
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      `Selecting brand file: ` +
      `${requiredFileName} ` +
      `(${requiredCategory})`
    );

    const categoryLabel =
      this.addBrandFileDialog
        .getByText(
          requiredCategory,
          {
            exact: true
          }
        );

    await expect(
      categoryLabel
    ).toBeVisible({
      timeout: 15000
    });

    /*
     * The dialog can contain the same filename
     * in different categories. The category
     * identifies the correct card.
     */
    const fileOption =
      categoryLabel.locator(
        'xpath=ancestor::div[' +
        `.//*[normalize-space()="${requiredFileName}"]` +
        '][1]'
      );

    await expect(
      fileOption
    ).toBeVisible({
      timeout: 15000
    });

    const alreadyAttached =
      await fileOption
        .getByText(
          /already attached/i
        )
        .isVisible()
        .catch(() => false);

    if (!alreadyAttached) {
      await fileOption.click();
    }

    await this.page.waitForTimeout(500);

    /*
     * The dialog may remain open after the
     * file is attached.
     */
    if (
      await this.addBrandFileDialog
        .isVisible()
        .catch(() => false)
    ) {
      const closeButton =
        this.addBrandFileDialog
          .getByRole(
            'button',
            {
              name: /close/i
            }
          )
          .first();

      if (
        await closeButton
          .isVisible()
          .catch(() => false)
      ) {
        await closeButton.click();
      } else {
        await this.page.keyboard.press(
          'Escape'
        );
      }
    }

    await expect(
      this.addBrandFileDialog
    ).toBeHidden({
      timeout: 10000
    });

    await expect.poll(
      async () =>
        this.isBrandFileAttached(
          requiredFileName
        ),
      {
        timeout: 20000,
        intervals: [
          500,
          1000,
          2000
        ],
        message:
          `Waiting for ${requiredFileName} ` +
          'to appear in Campaign Assets'
      }
    ).toBeTruthy();

    console.log(
      `Brand file attached to campaign: ` +
      `${requiredFileName}`
    );

    return true;
  }

  async verifyCampaignAssetsState() {
    const sectionExpanded =
      await this.openCampaignAssets();

    const selectedAssetCount =
      await this.getSelectedAssetCount();

    const imageActionVisible =
      await this.addBrandLabImage
        .isVisible()
        .catch(() => false);

    const fileActionVisible =
      await this.addBrandFileAction
        .isVisible()
        .catch(() => false);

    const generateActionVisible =
      await this.generateNewButton
        .isVisible()
        .catch(() => false);

    const emptyStateVisible =
      await this.noKitCreativesMessage
        .isVisible()
        .catch(() => false);

    console.log(
      `Selected campaign assets: ` +
      `${selectedAssetCount}`
    );

    return {
      sectionExpanded,
      hasAssets:
        selectedAssetCount > 0,
      selectedAssetCount,
      emptyState:
        emptyStateVisible &&
        selectedAssetCount === 0,
      imageActionVisible,
      fileActionVisible,
      generateActionVisible
    };
  }

  // ==========================================
  // AUDIENCE
  // ==========================================

  async verifyAudienceSection() {
    const audienceAvailable =
      await this.audienceTitle
        .waitFor({
          state: 'visible',
          timeout: 20000
        })
        .then(() => true)
        .catch(() => false);

    if (!audienceAvailable) {
      throw new Error(
        'Audience section is not available. ' +
        'Verify that a saved audience exists ' +
        'for the selected brand.'
      );
    }

    await this.audienceTitle
      .scrollIntoViewIfNeeded();

    await expect.poll(
      async () =>
        await this.audienceSearchInput
          .isVisible()
          .catch(() => false) ||
        await this.audienceEmptyMessage
          .isVisible()
          .catch(() => false),
      {
        timeout: 30000,
        intervals: [
          500,
          1000,
          2000
        ]
      }
    ).toBeTruthy();

    return {
      emptyState:
        await this.audienceEmptyMessage
          .isVisible()
          .catch(() => false)
    };
  }

  async attachAudience(audienceName) {
    if (!audienceName?.trim()) {
      throw new Error(
        'CAMPAIGN_AUDIENCE must contain ' +
        'an existing saved audience name.'
      );
    }

    const requiredAudience =
      audienceName.trim();

    const audienceState =
      await this.verifyAudienceSection();

    if (audienceState.emptyState) {
      throw new Error(
        `No saved audience is available for ` +
        `the selected brand. Required audience: ` +
        `${requiredAudience}`
      );
    }

    await expect(
      this.audienceSearchInput
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      `Searching for audience: ` +
      `${requiredAudience}`
    );

    await this.audienceSearchInput.fill(
      requiredAudience
    );

    const audienceNameElement =
      this.page.getByText(
        requiredAudience,
        {
          exact: true
        }
      ).first();

    await expect(
      audienceNameElement
    ).toBeVisible({
      timeout: 20000
    });

    const audienceCard =
      audienceNameElement.locator(
        'xpath=ancestor::div[' +
        './/*[contains(' +
        'normalize-space(.),"people"' +
        ')]' +
        '][1]'
      );

    await expect(
      audienceCard
    ).toBeVisible({
      timeout: 15000
    });

    /*
     * Prefer semantic checkbox/radio controls
     * when the application exposes them.
     */
    const semanticSelector =
      audienceCard.locator(
        'input[type="checkbox"], ' +
        'input[type="radio"], ' +
        '[role="checkbox"], ' +
        '[role="radio"]'
      ).first();

    if (
      await semanticSelector
        .isVisible()
        .catch(() => false)
    ) {
      await semanticSelector.click();
    } else {
      /*
       * The current UI uses a custom circular
       * selector near the left edge.
       */
      const cardBox =
        await audienceCard.boundingBox();

      if (!cardBox) {
        throw new Error(
          `Audience card position could not ` +
          `be calculated: ${requiredAudience}`
        );
      }

      await this.page.mouse.click(
        cardBox.x + 32,
        cardBox.y +
          cardBox.height / 2
      );
    }

    await this.page.waitForTimeout(500);

    console.log(
      `Audience selected: ` +
      `${requiredAudience}`
    );

    return true;
  }

  // ==========================================
  // CONTINUE TO CHANNELS
  // ==========================================

  async canContinueToChannels() {
    await this.continueButton
      .scrollIntoViewIfNeeded();

    await expect(
      this.continueButton
    ).toBeVisible();

    return this.continueButton
      .isEnabled()
      .catch(() => false);
  }

async continueToChannels() {
  await this.continueButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.continueButton
  ).toBeVisible({
    timeout: 20000
  });

  await expect(
    this.continueButton
  ).toBeEnabled({
    timeout: 20000
  });

  console.log(
    `URL before Continue: ${this.page.url()}`
  );

  await this.continueButton.click();

  /*
   * Actual route:
   * /campaigns/{campaign-id}/channels
   */
  await this.page.waitForURL(
    url =>
      /\/campaigns\/[^/]+\/channels\/?$/.test(
        url.pathname
      ),
    {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    }
  );

  await expect(
    this.channelsHeading
  ).toBeVisible({
    timeout: 30000
  });

  await expect(
    this.saveAndContinueButton
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    'Channels & Budget page opened.'
  );

  console.log(
    `Current URL: ${this.page.url()}`
  );
}

  // ==========================================
  // CHANNEL ALLOCATIONS
  // ==========================================

  getChannelCard(name) {
    return this.page
      .getByText(
        name,
        { exact: true }
      )
      .first()
      .locator(
        'xpath=ancestor::div[' +
        './/*[@role="slider"] or ' +
        './/input[@type="range"]' +
        '][1]'
      );
  }

  async getChannelAllocation(name) {
    const card =
      this.getChannelCard(name);

    await expect(
      card
    ).toBeVisible();

    const text = (
      await card.innerText()
    ).replace(/\s+/g, ' ').trim();

    const percentageMatch =
      text.match(
        /(\d+(?:\.\d+)?)%/
      );

    if (!percentageMatch) {
      throw new Error(
        `Allocation percentage was not ` +
        `found for ${name}. Text: ${text}`
      );
    }

    const percentage =
      Number(percentageMatch[1]);

    const budgetMatch =
      text.match(
        /₹\s*(\d+(?:\.\d+)?)\s*L/i
      );

    return {
      name,
      percentage,
      allocatedBudget:
        budgetMatch
          ? Number(budgetMatch[1])
          : null,
      text
    };
  }

  async verifyDefaultChannelMix() {
    const activeNames = [
      'LinkedIn',
      'Google Search',
      'Email',
      'WhatsApp Broadcast'
    ];

    const activeAllocations =
      await Promise.all(
        activeNames.map(
          name =>
            this.getChannelAllocation(
              name
            )
        )
      );

    for (
      const allocation of
      activeAllocations
    ) {
      expect(
        allocation.percentage
      ).toBeGreaterThan(0);
    }

    const total =
      activeAllocations.reduce(
        (
          currentTotal,
          allocation
        ) =>
          currentTotal +
          allocation.percentage,
        0
      );

    expect(total).toBe(100);

    const phaseTwoNames = [
      'Webinar',
      'Display + Retargeting'
    ];

    for (
      const name of phaseTwoNames
    ) {
      const allocation =
        await this.getChannelAllocation(
          name
        );

      expect(
        allocation.percentage
      ).toBe(0);

      await expect(
        this.getChannelCard(name)
      ).toContainText(/Phase 2/i);
    }

    await expect(
      this.totalAllocationText
    ).toBeVisible();
  }

  // ==========================================
  // PROJECTED METRICS
  // ==========================================

  async getProjectedMetrics() {
    await this.projectedOutcomeTitle
      .scrollIntoViewIfNeeded();

    const labels = [
      this.estimatedLeadsLabel,
      this.estimatedSqlsLabel,
      this.blendedCplLabel,
      this.budgetAllocatedLabel
    ];

    const values = [];

    for (const label of labels) {
      await expect(
        label
      ).toBeVisible();

      const card = label.locator(
        'xpath=ancestor::div[1]'
      );

      const text = (
        await card.innerText()
      ).replace(/,/g, '');

      const match =
        text.match(
          /\d+(?:\.\d+)?/
        );

      if (!match) {
        throw new Error(
          `Projected metric was not found. ` +
          `Text: ${text}`
        );
      }

      const value =
        Number(match[0]);

      expect(
        value
      ).toBeGreaterThanOrEqual(0);

      values.push(value);
    }

    return values;
  }

  async adjustChannelAndReset(
    channelName = 'LinkedIn'
  ) {
    const before =
      await this.getChannelAllocation(
        channelName
      );

    const card =
      this.getChannelCard(
        channelName
      );

    const slider = card
      .getByRole('slider')
      .or(
        card.locator(
          'input[type="range"]'
        )
      )
      .first();

    await expect(
      slider
    ).toBeEnabled();

    const direction =
      before.percentage < 100
        ? 'ArrowRight'
        : 'ArrowLeft';

    await slider.press(direction);

    await expect.poll(
      async () =>
        (
          await this
            .getChannelAllocation(
              channelName
            )
        ).percentage
    ).not.toBe(before.percentage);

    const changedMetrics =
      await this.getProjectedMetrics();

    await expect(
      this.resetAiMixButton
    ).toBeVisible();

    await this.resetAiMixButton.click();

    await expect.poll(
      async () =>
        (
          await this
            .getChannelAllocation(
              channelName
            )
        ).percentage
    ).toBe(before.percentage);

    return changedMetrics;
  }

  // ==========================================
  // VERIFY CHANNELS PAGE
  // ==========================================

  async verifyChannelsAndBudgetPage() {
  await expect(
    this.channelsHeading
  ).toBeVisible({
    timeout: 30000
  });

  await expect(
    this.aiRecommendationTitle
  ).toBeVisible();

  await this.verifyDefaultChannelMix();

  await this.getProjectedMetrics();

  await this.saveAndContinueButton
    .scrollIntoViewIfNeeded();

  await expect(
    this.saveAndContinueButton
  ).toBeVisible();

  await expect(
    this.saveAndContinueButton
  ).toBeEnabled();

  console.log(
    'Channels & Budget page verified.'
  );

  console.log(
    'Save & continue is enabled but was not clicked.'
  );
}

  async backToSetupAndVerify(data) {
    await this.channelsBackButton
      .scrollIntoViewIfNeeded();

    await this.channelsBackButton.click();

    await this.page.waitForURL(
      url =>
        url.pathname.includes(
          '/campaigns/setup'
        ),
      {
        timeout: 30000
      }
    );

    await expect(
      this.setupTitle
    ).toBeVisible();

    await this
      .verifySelectedCampaignDetails(
        data
      );
  }
}

module.exports = {
  CampaignsPage
};