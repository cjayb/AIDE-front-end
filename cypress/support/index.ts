// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// load type definitions that come with Cypress module
/// <reference types="cypress" />
const cypressTable = require("../../node_modules/cypress-get-table/src/index");

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>

      /**
       * Custom command to perform assertions on a table.
       * @example cy.get("table").getTable().should(($tableData) => ...)
       */
      getTable(): Chainable<Element>
    }
  }

  Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`)
  })
