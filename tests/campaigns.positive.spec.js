const path = require('path');

const {
  test,
  expect
} = require(
  '../fixtures/auth.fixture'
);

const {
  CampaignsPage
} = require(
  '../pages/CampaignsPage'
);

function requiredEnv(name) {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value.trim();
}

test.describe(
  'Redington Campaigns — Positive Cases',
  () => {
    test(
      'CMP-P-001: Campaigns dashboard loads',
      async ({
        authenticatedPage
      }) => {
        const campaignsPage =
          new CampaignsPage(
            authenticatedPage
          );

        await campaignsPage
          .openCampaigns();

        await expect(
          campaignsPage
            .createCampaignButton
        ).toBeVisible();
      }
    );

    test(
      'CMP-P-005 to CMP-P-040: configure campaign and verify channels without launching',
      async ({
        authenticatedPage
      }) => {
        test.setTimeout(300000);

        const campaignsPage =
          new CampaignsPage(
            authenticatedPage
          );

        const campaignData = {
          name:
            requiredEnv(
              'CAMPAIGN_NAME'
            ),

          brand:
            requiredEnv(
              'CAMPAIGN_BRAND'
            ),

          product:
            requiredEnv(
              'CAMPAIGN_PRODUCT'
            ),

          objective:
            requiredEnv(
              'CAMPAIGN_OBJECTIVE'
            ),

          persona:
            requiredEnv(
              'CAMPAIGN_PERSONA'
            )
        };

        // ======================================
        // OPEN CAMPAIGN SETUP
        // ======================================

        await campaignsPage
          .openCampaigns();

        await campaignsPage
          .startCampaign();

        // ======================================
        // CAMPAIGN DETAILS
        // ======================================

        await campaignsPage
          .fillCampaignDetails(
            campaignData
          );

        await campaignsPage
          .verifySelectedCampaignDetails(
            campaignData
          );

        // ======================================
        // GEOGRAPHY
        // ======================================

        await campaignsPage
          .enterGeographyAndContacts(
            requiredEnv(
              'CAMPAIGN_GEOGRAPHY'
            ),
            process.env
              .CAMPAIGN_CONTACTS
          );

        // ======================================
        // CAMPAIGN DURATION
        // ======================================

        await campaignsPage
          .selectCampaignDuration(
            requiredEnv(
              'CAMPAIGN_START_DATE'
            ),
            requiredEnv(
              'CAMPAIGN_END_DATE'
            )
          );

        await campaignsPage
          .verifyCampaignDuration();

        // ======================================
        // MDF BUDGET
        // ======================================

        const initialBudget =
          process.env
            .CAMPAIGN_MDF_BUDGET ||
          '12.5';

        await campaignsPage
          .verifyMdfBudget(
            initialBudget
          );

        const targetBudget =
          process.env
            .CAMPAIGN_TARGET_MDF_BUDGET;

        if (
          targetBudget &&
          targetBudget !==
            initialBudget
        ) {
          await campaignsPage
            .setMdfBudgetUsingMouse(
              targetBudget
            );

          await campaignsPage
            .verifyMdfBudget(
              targetBudget
            );
        }

        // ======================================
        // CAMPAIGN ASSETS
        // ======================================

        /*
         * Use CAMPAIGN_ASSET_FILE when supplied.
         * Otherwise use the configured brand
         * guideline filename.
         */
        // Attach the required brand file.
const assetFileName =
  process.env.CAMPAIGN_ASSET_FILE ||
  'dell-brand-guidelines.pdf';

const assetCategory =
  process.env.CAMPAIGN_ASSET_CATEGORY ||
  'guidelines';

await campaignsPage.attachBrandFile(
  assetFileName,
  assetCategory
);

// Verify that the brand file was attached.
const assetState =
  await campaignsPage.verifyCampaignAssetsState();

console.log(
  `Campaign assets selected: ` +
  `${assetState.selectedAssetCount}`
);

expect(
  assetState.selectedAssetCount
).toBeGreaterThan(0);

/*
 * The updated Campaign Setup UI does not expose
 * the Choose the audience section in this flow.
 * Continue after attaching the campaign asset.
 */
console.log(
  'Audience selection is not available in the ' +
  'updated Campaign Setup UI. Continuing to channels.'
);

const canContinue =
  await campaignsPage.canContinueToChannels();

expect(
  canContinue,
  'Continue to channels should be enabled after ' +
  'completing campaign details and attaching an asset.'
).toBeTruthy();

await campaignsPage.continueToChannels();

await campaignsPage.verifyChannelsAndBudgetPage();

// Safety boundary: do not launch the campaign.
await expect(
  campaignsPage.saveAndContinueButton
).toBeVisible();

await expect(
  campaignsPage.saveAndContinueButton
).toBeEnabled();

// Safety boundary:
// Do not click Save & continue because the next
// step is Outreach & launch.
console.log(
  'Channel mix verified. ' +
  'Save & continue was intentionally not clicked.'
);

// console.log(
//   'Campaign configuration and channel validation completed. ' +
//   'Launch Campaign was not clicked.'
// );
    }
    );
  }
);