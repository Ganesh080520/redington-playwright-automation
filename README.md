# Redington Playwright Automation

JavaScript Page Object Model framework for positive Login, Brand Creation and Campaign tests.

## Framework

```text
redington-playwright/
├── fixtures/
│   └── auth.fixture.js
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── BrandCreationPage.js
│   └── CampaignsPage.js
├── test-data/
│   └── README.md
├── tests/
│   ├── login.positive.spec.js
│   ├── brandCreation.positive.spec.js
│   └── campaigns.positive.spec.js
├── utils/
│   └── env.js
├── .env.example
├── package.json
└── playwright.config.js
```

## Setup on Windows

```powershell
cd T:\Redington_Playwright_Automation
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

Update `.env`, add the required files under `test-data`, then execute:

```powershell
npm run test:login
npm run test:brand
npm run test:campaign
npm test
```

Open the HTML report:

```powershell
npm run report
```

## Execution prerequisites

- Login service and application backend must be running.
- Brand test requires valid guideline and primary-logo files.
- Campaign test requires an approved brand, approved assets and saved audience.
- Campaign launch is intentionally not automated until the exact Channels & Launch elements are inspected.
