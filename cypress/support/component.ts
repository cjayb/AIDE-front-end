// Import commands.js using ES2015 syntax:
import { Commands } from "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from "cypress/vue2";
import vuetify from "../../src/plugins/vuetify";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add("mount", (component, options) => {
    return mount(component, { vuetify, ...options });
});

Cypress.Commands.add("dataCy", Commands.dataCy);
