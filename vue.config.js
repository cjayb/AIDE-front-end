const { defineConfig } = require("@vue/cli-service");
const { join } = require("path");

module.exports = defineConfig({
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        resolve: {
            alias: {
                "keycloak-js": join(__dirname, "node_modules/keycloak-js"),
            },
        },
        experiments: {
            topLevelAwait: process.env.NODE_ENV === "development",
        },
    },
});
