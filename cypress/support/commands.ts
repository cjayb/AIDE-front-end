/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-cy attribute.
             * @example cy.dataCy('greeting')
             */
            dataCy: typeof dataCy;

            /**
             * Custom command to perform assertions on a table.
             * @example cy.get("table").getTable().should(($tableData) => ...)
             */
            getTable(): Chainable;
        }
    }
}

const dataCy = (value: string) => cy.get(`[data-cy=${value}]`);

export const Commands = {
    dataCy,
};
