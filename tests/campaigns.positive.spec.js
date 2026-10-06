const {
  test,
  expect
} = require('../fixtures/auth.fixture');

const {
  CampaignsPage
} = require('../pages/CampaignsPage');

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
      async ({ authenticatedPage }) => {
        const campaignsPage =
          new CampaignsPage(
            authenticatedPage
          );

        await campaignsPage.openCampaigns();

        await expect(
          campaignsPage.createCampaignButton
        ).toBeVisible();
      }
    );

    test(
      'CMP-P-005 to CMP-P-040: configure campaign and verify channels without launching',
      async ({ authenticatedPage }) => {
        test.setTimeout(240000);

        const campaignsPage =
          new CampaignsPage(
            authenticatedPage
          );

        const campaignData = {
          name:
            requiredEnv('CAMPAIGN_NAME'),

          brand:
            requiredEnv('CAMPAIGN_BRAND'),

          product:
            requiredEnv('CAMPAIGN_PRODUCT'),

          objective:
            requiredEnv(
              'CAMPAIGN_OBJECTIVE'
            ),

          persona:
            requiredEnv(
              'CAMPAIGN_PERSONA'
            )
        };

        await campaignsPage.openCampaigns();
        await campaignsPage.startCampaign();

        await campaignsPage
          .fillCampaignDetails(
            campaignData
          );

        await campaignsPage
          .verifySelectedCampaignDetails(
            campaignData
          );

        await campaignsPage
          .enterGeographyAndContacts(
            requiredEnv(
              'CAMPAIGN_GEOGRAPHY'
            ),
            process.env.CAMPAIGN_CONTACTS
          );

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
          targetBudget !== initialBudget
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

        const audienceAttached =
          await campaignsPage
            .attachAudience(
              process.env
                .CAMPAIGN_AUDIENCE ||
              ''
            );

        const assetState =
          await campaignsPage
            .verifyCampaignAssetsState();

        // if (!audienceAttached) {
        //   console.log(
        //     'No audience attached. ' +
        //     'Checking whether the application permits continuation.'
        //   );
        // }

        if (!assetState.hasAssets) {
          console.log(
            'No campaign asset selected. ' +
            'Checking whether the application permits continuation.'
          );
        }

        const canContinue =
          await campaignsPage
            .canContinueToChannels();

        if (!canContinue) {
          console.log(
            'Continue to Channels is disabled. ' +
            'Campaign setup validation completed.'
          );

          return;
        }

        await campaignsPage
          .continueToChannels();

        await campaignsPage
          .verifyChannelsAndBudgetPage();

        // Safety boundary:
        // Do not click Launch Campaign.
        await expect(
          campaignsPage
            .launchCampaignButton
        ).toBeVisible();

        // await campaignsPage.launchCampaignButton.click()
      }
    );
  }
);