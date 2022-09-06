const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: ["vuetify"],
    configureWebpack: {
        experiments: {
            topLevelAwait: process.env.NODE_ENV === "development",
        },
    },
});
