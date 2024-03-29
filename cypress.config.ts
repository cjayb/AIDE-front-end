/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
