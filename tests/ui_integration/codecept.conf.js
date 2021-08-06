require("ts-node/register");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run

exports.config = {
    tests: "./tests/**_test.ts",
    output: "./output",
    helpers: {
        Playwright: {
            url: "http://localhost:8080",
            show: true,
            windowSize: "1366x768",
            waitForTimeout: 3000,
            restart: false,
            browser: "chromium",
            keepCookies: true,
            keepBrowserState: true,
            waitForNavigation: "domcontentloaded",
            chromium: {
                args: [
                    "--no-sandbox",
                    "--disable-popup-blocking",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                ],
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
            reportFilename: "ui-integration-chrome",
        },
    },
    include: {
        ...require("./pages"),
        mocks: "./mocks/mockIndex.ts",
        keycloakMock: "./utils/keycloak_mock.ts",
        screenshotter: "./utils/screenshotter.ts",
    },
    name: "CodeceptJS",
    plugins: {
        pauseOnFail: {},
        retryFailedStep: {
            enabled: false,
        },
        autoDelay: {
            enabled: false,
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
