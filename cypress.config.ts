import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  chromeWebSecurity: false,
  video: false,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "http://localhost:8080",
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
});
