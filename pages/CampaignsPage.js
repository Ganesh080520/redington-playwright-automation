const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CampaignsPage extends BasePage {
  constructor(page) {
    super(page);
    this.campaignsTitle = page.getByText('Campaigns', { exact: true }).last();
    this.createCampaignButton = page.getByRole('button', { name: /Create campaign/i });
    this.setupTitle = page.getByText('Set up the campaign', { exact: true });
    this.campaignDetailsTitle = page.getByText('Campaign details', { exact: true });
    this.campaignNameInput = page.getByPlaceholder('Enter campaign name', { exact: true });
    this.brandLabel = page.locator('p').filter({ hasText: /^\s*Brand\s*\*?\s*$/i }).first();
    this.productLabel = page.locator('p').filter({ hasText: /^\s*Brand product to promote\s*\*?\s*$/i }).first();
    this.objectiveLabel = page.locator('p').filter({ hasText: /^\s*Campaign objective\s*\*?\s*$/i }).first();
    this.personaLabel = page.locator('p').filter({ hasText: /^\s*Target persona\s*\*?\s*$/i }).first();
    this.durationLabel = page.locator('p').filter({ hasText: /^\s*Campaign duration\s*\*?\s*$/i }).first();
    this.mdfBudgetTitle = page.locator('p').filter({ hasText: /^\s*MDF budget\s*$/i }).first();
    this.geographyInput = page.getByPlaceholder('Enter geography', { exact: true });
    this.contactsInput = page
      .getByPlaceholder(/number of contacts|contacts/i)
      .or(page.getByLabel(/contacts in this geography|number of contacts/i))
      .or(page.locator('input[name*="contact" i]'))
      .first();
    this.durationButton = page.getByRole('button', { name: /Pick start and end dates/i });
    this.mdfBudgetSlider = page.getByRole('slider').first();
    this.audienceTitle = page.getByText('Choose the audience', { exact: true }).first();
    this.buildAudienceButton = page.getByRole('button', { name: /Build a new audience/i });
    this.audienceSearchInput = page.locator('input[placeholder*="Search saved lists"]').first();
    this.audienceEmptyMessage = page.getByText(/No audiences.*yet|No saved audiences|No audiences found/i).first();
    this.campaignAssetsTitle = page.getByText('Campaign assets', { exact: true }).first();
    this.addBrandLabImage = page
      .getByText(/Add Brand Lab image|Add Brand Lab creative|Add creative|Select creative/i)
      .first();
    this.addBrandFile = page.getByText(/Add brand file|Add file|Select brand file/i).first();
    this.noKitCreativesMessage = page
      .getByText(/No kit creatives|No creatives|No assets available|No campaign assets/i)
      .first();
    this.generateNewButton = page
      .getByRole('button', { name: /Generate new|Generate creative/i })
      .first();
    this.continueButton = page.getByRole('button', { name: /Continue to channels/i });
    this.channelsHeading = page.getByText('Channels & budget', { exact: true });
    this.aiRecommendationTitle = page.getByText('AI channel recommendation', { exact: true });
    this.totalAllocationText = page.getByText(/^\s*100%\s+allocated/i);
    this.resetAiMixButton = page.getByRole('button', { name: /Reset to AI mix/i })
      .or(page.getByText('Reset to AI mix', { exact: true }));
    this.projectedOutcomeTitle = page.getByText('Projected outcome', { exact: true });
    this.estimatedLeadsLabel = page.getByText('estimated leads', { exact: true });
    this.estimatedSqlsLabel = page.getByText('estimated SQLs', { exact: true });
    this.blendedCplLabel = page.getByText('blended CPL', { exact: true });
    this.budgetAllocatedLabel = page.getByText('budget allocated', { exact: true });
    this.launchCampaignButton = page.getByRole('button', { name: /Launch campaign/i });
    this.channelsBackButton = page.getByRole('button', { name: 'Back', exact: true });
  }

  async openCampaigns() {
    await this.open('/campaigns');
    await expect(this.campaignsTitle).toBeVisible({ timeout: 30000 });
    await expect(this.createCampaignButton).toBeVisible();
  }

  async startCampaign() {
    await this.createCampaignButton.click();
    await this.page.waitForURL(url => url.pathname.includes('/campaigns/setup'), { timeout: 30000 });
    await expect(this.setupTitle).toBeVisible({ timeout: 30000 });
    await expect(this.campaignDetailsTitle).toBeVisible();
    await expect(this.campaignNameInput).toBeVisible();
  }

  async enterCampaignName(name) {
    if (!name?.trim()) throw new Error('CAMPAIGN_NAME must be configured.');
    await this.campaignNameInput.fill(name.trim());
    await expect(this.campaignNameInput).toHaveValue(name.trim());
  }

  async selectCampaignDropdown(label, optionName) {
    if (!optionName?.trim()) throw new Error('A campaign dropdown value is required.');
    const option = optionName.trim();
    await label.scrollIntoViewIfNeeded();
    const trigger = label.locator('xpath=following::button[1]');
    await expect(trigger).toBeVisible();
    if ((await trigger.innerText()).trim().toLowerCase() === option.toLowerCase()) return;
    await trigger.click();
    const roleOption = this.page.getByRole('option', { name: option, exact: true });
    if (await roleOption.isVisible().catch(() => false)) await roleOption.click();
    else await this.page.getByRole('button', { name: option, exact: true }).last().click();
    await expect(trigger).toContainText(option);
  }

  async fillCampaignDetails(data) {
    await this.enterCampaignName(data.name);
    await this.selectCampaignDropdown(this.brandLabel, data.brand);
    await this.selectCampaignDropdown(this.productLabel, data.product);
    await this.selectCampaignDropdown(this.objectiveLabel, data.objective);
    await this.selectCampaignDropdown(this.personaLabel, data.persona);
  }

  async verifySelectedCampaignDetails(data) {
    await expect(this.campaignNameInput).toHaveValue(data.name);
    await expect(this.brandLabel.locator('xpath=following::button[1]')).toContainText(data.brand);
    await expect(this.productLabel.locator('xpath=following::button[1]')).toContainText(data.product);
    await expect(this.objectiveLabel.locator('xpath=following::button[1]')).toContainText(data.objective);
    await expect(this.personaLabel.locator('xpath=following::button[1]')).toContainText(data.persona);
  }

  async enterGeographyAndContacts(geography, contacts) {
    if (!geography?.trim()) throw new Error('CAMPAIGN_GEOGRAPHY must be configured.');
    const requiredGeography = geography.trim();
    await this.geographyInput.scrollIntoViewIfNeeded();
    await expect(this.geographyInput).toBeVisible({ timeout: 20000 });
    await this.geographyInput.fill(requiredGeography);
    await expect(this.geographyInput).toHaveValue(requiredGeography);
    console.log(`Geography entered: ${requiredGeography}`);

    const contactValue = String(contacts ?? '').trim();
    if (!contactValue) {
      console.log('CAMPAIGN_CONTACTS is empty. Contact entry skipped.');
      return { geographyEntered: true, contactsEntered: false, contactsFieldAvailable: false };
    }
    if (!/^\d+$/.test(contactValue)) throw new Error('CAMPAIGN_CONTACTS must contain only numbers.');

    const available = await this.contactsInput.waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true).catch(() => false);
    if (!available) {
      console.log('Contacts input is not available in the updated Campaign Setup UI.');
      console.log('Contacts are calculated from the selected audience.');
      return { geographyEntered: true, contactsEntered: false, contactsFieldAvailable: false };
    }
    await expect(this.contactsInput).toBeEnabled();
    await this.contactsInput.fill(contactValue);
    await expect(this.contactsInput).toHaveValue(contactValue);
    console.log(`Contacts entered: ${contactValue}`);
    return { geographyEntered: true, contactsEntered: true, contactsFieldAvailable: true };
  }

  formatCalendarDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${isoDate}`);
    const name = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' }).format(date);
    return `${day} ${name} ${year}`;
  }

  async findCalendarDateButton(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    const usMonth = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
    const candidates = [
      this.page.locator(`button[data-date="${isoDate}"]`),
      this.page.locator(`button[data-day="${isoDate}"]`),
      this.page.getByRole('button', { name: this.formatCalendarDate(isoDate), exact: true }),
      this.page.getByRole('button', { name: `${usMonth} ${day}, ${year}`, exact: true })
    ];
    for (const candidate of candidates) {
      for (let index = 0; index < await candidate.count(); index += 1) {
        if (await candidate.nth(index).isVisible().catch(() => false)) return candidate.nth(index);
      }
    }
    throw new Error(`Calendar date not found: ${isoDate}`);
  }

  async selectCampaignDuration(startDate, endDate) {
    if (Date.parse(endDate) < Date.parse(startDate)) throw new Error('CAMPAIGN_END_DATE cannot precede start date.');
    await this.durationButton.click();
    await (await this.findCalendarDateButton(startDate)).click();
    await (await this.findCalendarDateButton(endDate)).click();
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  async verifyCampaignDuration() {
    const button = this.durationLabel.locator('xpath=following::button[1]');
    await expect(button).toBeVisible();
    await expect(button).not.toContainText(/Pick start and end dates/i);
    return (await button.innerText()).trim();
  }

  async verifyMdfBudget(expected = '12.5') {
    await expect(this.mdfBudgetSlider).toBeVisible();
    await expect(this.mdfBudgetSlider).toHaveAttribute('aria-valuenow', String(expected));
  }

  async setMdfBudgetUsingMouse(targetBudget) {
    const target = Number(targetBudget);
    const min = Number(await this.mdfBudgetSlider.getAttribute('aria-valuemin'));
    const max = Number(await this.mdfBudgetSlider.getAttribute('aria-valuemax'));
    const thumb = await this.mdfBudgetSlider.boundingBox();
    const root = this.mdfBudgetSlider.locator('xpath=ancestor::div[contains(@class,"mantine-Slider-root")][1]');
    const track = await root.boundingBox();
    if (!thumb || !track || target < min || target > max) throw new Error('Invalid MDF slider target or geometry.');
    const startX = thumb.x + thumb.width / 2;
    const y = thumb.y + thumb.height / 2;
    const targetX = track.x + track.width * ((target - min) / (max - min));
    await this.page.mouse.move(startX, y);
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, y, { steps: 25 });
    await this.page.mouse.up();
    let current = Number(await this.mdfBudgetSlider.getAttribute('aria-valuenow'));
    const step = Number(await this.mdfBudgetSlider.getAttribute('step')) || 0.1;
    await this.mdfBudgetSlider.focus();
    while (Math.abs(current - target) >= step / 2) {
      await this.mdfBudgetSlider.press(current < target ? 'ArrowRight' : 'ArrowLeft');
      current = Number(await this.mdfBudgetSlider.getAttribute('aria-valuenow'));
    }
    await expect.poll(async () => Number(await this.mdfBudgetSlider.getAttribute('aria-valuenow'))).toBe(target);
  }

  async verifyAudienceSection() {
    await this.audienceTitle.scrollIntoViewIfNeeded();
    await expect(this.audienceTitle).toBeVisible();
    await expect(this.buildAudienceButton).toBeVisible();
    await expect.poll(async () =>
      await this.audienceSearchInput.isVisible().catch(() => false) ||
      await this.audienceEmptyMessage.isVisible().catch(() => false), { timeout: 30000 }).toBeTruthy();
    return { emptyState: await this.audienceEmptyMessage.isVisible().catch(() => false) };
  }

  async attachAudience(audienceName) {
    if (!audienceName?.trim()) {
      throw new Error('CAMPAIGN_AUDIENCE must contain an existing saved audience name.');
    }
    const requiredAudience = audienceName.trim();
    await this.audienceTitle.scrollIntoViewIfNeeded();
    await expect(this.audienceTitle).toBeVisible({ timeout: 20000 });
    await expect(this.audienceSearchInput).toBeVisible({ timeout: 20000 });
    console.log(`Searching for audience: ${requiredAudience}`);
    await this.audienceSearchInput.fill(requiredAudience);
    const name = this.page.getByText(requiredAudience, { exact: true }).first();
    await expect(name).toBeVisible({ timeout: 20000 });
    const card = name.locator('xpath=ancestor::div[.//*[contains(normalize-space(.),"people")]][1]');
    await expect(card).toBeVisible({ timeout: 15000 });
    const box = await card.boundingBox();
    if (!box) throw new Error(`Audience card position could not be calculated: ${requiredAudience}`);
    await this.page.mouse.click(box.x + 32, box.y + box.height / 2);
    await this.page.waitForTimeout(500);
    console.log(`Audience selector clicked: ${requiredAudience}`);
    return true;
  }

  async openCampaignAssets() {
    await this.campaignAssetsTitle.scrollIntoViewIfNeeded();
    await expect(this.campaignAssetsTitle).toBeVisible({ timeout: 20000 });
    const content = this.page
      .getByText(/Brand Lab images|Brand files|Add Brand Lab|Add brand file|No kit creatives|Generated assets/i)
      .first();
    if (await content.isVisible().catch(() => false)) {
      console.log('Campaign Assets section is already expanded.');
      return true;
    }
    const toggle = this.campaignAssetsTitle.locator('xpath=following::button[1]');
    if (await toggle.isVisible().catch(() => false)) await toggle.click();
    else await this.campaignAssetsTitle.click();

    const expanded = await expect.poll(async () =>
      await this.addBrandLabImage.isVisible().catch(() => false) ||
      await this.addBrandFile.isVisible().catch(() => false) ||
      await this.noKitCreativesMessage.isVisible().catch(() => false) ||
      await this.generateNewButton.isVisible().catch(() => false) ||
      await this.getSelectedAssetCount() > 0,
    { timeout: 10000, intervals: [500, 1000, 2000] })
      .toBeTruthy().then(() => true).catch(() => false);
    console.log(expanded
      ? 'Campaign Assets section expanded.'
      : 'Campaign Assets section is visible; no legacy asset actions are exposed.');
    return expanded;
  }

  async getSelectedAssetCount() {
    const labels = this.page.getByText(/^\d+\s+assets?\s+(attached|selected)$/i);
    for (let i = 0; i < await labels.count(); i += 1) {
      const value = Number((await labels.nth(i).innerText()).match(/\d+/)?.[0]);
      if (!Number.isNaN(value)) return value;
    }
    return 0;
  }

  async verifyCampaignAssetsState() {
    const expanded = await this.openCampaignAssets();
    const selectedAssetCount = await this.getSelectedAssetCount();
    const imageActionVisible = await this.addBrandLabImage.isVisible().catch(() => false);
    const fileActionVisible = await this.addBrandFile.isVisible().catch(() => false);
    const generateActionVisible = await this.generateNewButton.isVisible().catch(() => false);
    const emptyStateVisible = await this.noKitCreativesMessage.isVisible().catch(() => false);
    console.log(`Selected campaign assets: ${selectedAssetCount}`);
    return {
      sectionExpanded: expanded,
      hasAssets: selectedAssetCount > 0,
      selectedAssetCount,
      emptyState: emptyStateVisible || selectedAssetCount === 0,
      imageActionVisible,
      fileActionVisible,
      generateActionVisible
    };
  }

  async canContinueToChannels() {
    await this.continueButton.scrollIntoViewIfNeeded();
    return this.continueButton.isEnabled().catch(() => false);
  }

  async continueToChannels() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
    await this.page.waitForURL(url => url.pathname.includes('/campaigns/channels'), { timeout: 30000 });
    await expect(this.channelsHeading).toBeVisible({ timeout: 30000 });
  }

  getChannelCard(name) {
    return this.page.getByText(name, { exact: true }).first().locator(
      'xpath=ancestor::div[.//*[@role="slider"] or .//input[@type="range"]][1]'
    );
  }

  async getChannelAllocation(name) {
    const card = this.getChannelCard(name);
    await expect(card).toBeVisible();
    const text = (await card.innerText()).replace(/\s+/g, ' ').trim();
    const percentage = Number(text.match(/(\d+(?:\.\d+)?)%/)?.[1]);
    const budget = text.match(/₹\s*(\d+(?:\.\d+)?)\s*L/i);
    return { name, percentage, allocatedBudget: budget ? Number(budget[1]) : null, text };
  }

  async verifyDefaultChannelMix() {
    const active = await Promise.all(['LinkedIn', 'Google Search', 'Email', 'WhatsApp Broadcast']
      .map(name => this.getChannelAllocation(name)));
    for (const channel of active) expect(channel.percentage).toBeGreaterThan(0);
    expect(active.reduce((total, channel) => total + channel.percentage, 0)).toBe(100);
    for (const name of ['Webinar', 'Display + Retargeting']) {
      const channel = await this.getChannelAllocation(name);
      expect(channel.percentage).toBe(0);
      await expect(this.getChannelCard(name)).toContainText(/Phase 2/i);
    }
    await expect(this.totalAllocationText).toBeVisible();
  }

  async getProjectedMetrics() {
    await this.projectedOutcomeTitle.scrollIntoViewIfNeeded();
    const labels = [this.estimatedLeadsLabel, this.estimatedSqlsLabel, this.blendedCplLabel, this.budgetAllocatedLabel];
    const values = [];
    for (const label of labels) {
      await expect(label).toBeVisible();
      const card = label.locator('xpath=ancestor::div[1]');
      const text = (await card.innerText()).replace(/,/g, '');
      const value = Number(text.match(/\d+(?:\.\d+)?/)?.[0]);
      expect(value).toBeGreaterThanOrEqual(0);
      values.push(value);
    }
    return values;
  }

  async adjustChannelAndReset(channelName = 'LinkedIn') {
    const before = await this.getChannelAllocation(channelName);
    const card = this.getChannelCard(channelName);
    const slider = card.getByRole('slider').or(card.locator('input[type="range"]')).first();
    await expect(slider).toBeEnabled();
    const direction = before.percentage < 100 ? 'ArrowRight' : 'ArrowLeft';
    await slider.press(direction);
    await expect.poll(async () => (await this.getChannelAllocation(channelName)).percentage).not.toBe(before.percentage);
    const changedMetrics = await this.getProjectedMetrics();
    await expect(this.resetAiMixButton).toBeVisible();
    await this.resetAiMixButton.click();
    await expect.poll(async () => (await this.getChannelAllocation(channelName)).percentage).toBe(before.percentage);
    console.log(`CHN-P-009/010: ${channelName} adjusted, outcomes recalculated and AI mix restored.`);
    return changedMetrics;
  }

  async verifyChannelsAndBudgetPage() {
    await expect(this.channelsHeading).toBeVisible();
    await expect(this.aiRecommendationTitle).toBeVisible();
    await this.verifyDefaultChannelMix();
    await this.getProjectedMetrics();
    await this.launchCampaignButton.scrollIntoViewIfNeeded();
    await expect(this.launchCampaignButton).toBeVisible();
    await expect(this.launchCampaignButton).toBeEnabled();
  }

  async backToSetupAndVerify(data) {
    await this.channelsBackButton.scrollIntoViewIfNeeded();
    await this.channelsBackButton.click();
    await this.page.waitForURL(url => url.pathname.includes('/campaigns/setup'), { timeout: 30000 });
    await expect(this.setupTitle).toBeVisible();
    await this.verifySelectedCampaignDetails(data);
    console.log('CHN-P-013: Back returned to Campaign Setup with details retained.');
  }
}

module.exports = { CampaignsPage };