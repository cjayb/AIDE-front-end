exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'https://demoqa.com/automation-practice-form',
      show: true,
      windowSize: "1920x1080",
      waitForTimeout: 3000,
      restart: false,
      browser: "webkit",
      keepCookies: true,
      keepBrowserState: true,
      waitForNavigation: "domcontentloaded",
      webkit: {
          args: ["--no-sandbox", "--start-maximized", "--disable-popup-blocking", "--disable-setuid-sandbox"]
      }
    },
    PlaywrightHelper: {
      require: "./helpers/playwright_helper.js"
    },
    Mochawesome: {
      "uniqueScreenshotNames": "true",
      "disableScreenshots" : "false"
    },
    ResembleHelper: {
      prepareBaseImage: false,
      require: "codeceptjs-resemblehelper",
      screenshotFolder: "./tests/ui_integration/screenshots/current/",
      baseFolder: "./tests/ui_integration/screenshots/base/",
      diffFolder: "./tests/ui_integration/screenshots/diff/",
    }
  },
  include: {
    I: './steps_file.js',
    ...require("./pages")
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      "reporter": "mochawesome",
      "reportDir": "./tests/ui_integration/output",
      "inlineAssets": true,
      "reportFilename": "ui-integration-chrome"
    }
  },
  name: 'CodeceptJS',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    customLocator: {
      enabled: true,
      strategy: "css",
      attribute: "data-test-id"
    }
  }
}