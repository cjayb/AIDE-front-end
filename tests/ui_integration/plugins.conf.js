exports.config = {
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