require("ts-node/register");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run

exports.config = {
    tests: "./tests/**_test.ts",
    output: "./output",
    helpers: {
        Playwright: {
            url: "https://demoqa.com/automation-practice-form",
            show: true,
            windowSize: "1920x1080",
            waitForTimeout: 3000,
            restart: false,
            browser: "firefox",
            keepCookies: true,
            keepBrowserState: true,
            waitForNavigation: "domcontentloaded",
            firefox: {
                args: ["--no-sandbox", "--disable-popup-blocking", "--disable-setuid-sandbox"],
            },
        },
        PlaywrightHelper: {
            require: "./helpers/PlaywrightHelper.ts",
        },
        Mochawesome: {
            uniqueScreenshotNames: "true",
            disableScreenshots: "false",
        },
        ResembleHelper: {
            prepareBaseImage: false,
            require: "codeceptjs-resemblehelper",
            screenshotFolder: "./screenshots/current/",
            baseFolder: "./screenshots/base/",
            diffFolder: "./screenshots/diff/",
        },
    },
    bootstrap: null,
    mocha: {
        reporterOptions: {
            reporter: "mochawesome",
            reportDir: "output",
            inlineAssets: true,
            reportFilename: "ui-integration-firefox",
        },
    },
    include: {
        ...require("./pages"),
        screenshotter: "./utils/screenshotter.ts",
    },
    name: "CodeceptJS",
    plugins: {
        pauseOnFail: {},
        retryFailedStep: {
            enabled: false,
        },
        autoDelay: {
            enabled: true,
        },
        tryTo: {
            enabled: true,
        },
        screenshotOnFail: {
            enabled: true,
        },
        customLocator: {
            enabled: true,
            strategy: "css",
            attribute: "data-test",
        },
    },
};
