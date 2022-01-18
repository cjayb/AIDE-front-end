/// <reference types="cypress" />

import appStorePage from "../pages/appStore";
import { ApplicationData } from "../data/application";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import scrollToBottom from "scroll-to-bottomjs";

const appPage = new appStorePage();

describe("App Store Page", () => {
    beforeEach(() => {
        appPage.initPage();
        cy.injectAxe();
    });

    it("A user can access the app store via the button", () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        cy.visit("/#/clinical-review/");
        appPage.clickAppStoreButton().assertAppStorePageShows();
    });

    it("A Percy screenshot test for the application table", () => {
        cy.window().then((cyWindow) => scrollToBottom({ remoteWindow: cyWindow }));
        cy.dataCy("application-table").percySnapshotElement("Application Table");
    });

    it("An app missing an image displays correctly", () => {
        appPage.assertApp(ApplicationData.MISSING_IMAGE_APP);
    });

    it("An app with a CE logo displays correctly", () => {
        appPage.assertApp(ApplicationData.CE_APP);
    });

    it("An app with a UKCA logo displays correctly", () => {
        appPage.assertApp(ApplicationData.UKCA_APP);
    });

    it("An app with a FDA logo displays correctly", () => {
        appPage.assertApp(ApplicationData.FDA_APP);
    });

    it("An app with specialties displays correctly", () => {
        appPage.assertApp(ApplicationData.SPECIALTY_APP);
    });

    it("A long short description is shortened with ellipses", () => {
        appPage.assertApp(ApplicationData.LONG_DESCRIPTION_APP);
    });
});

describe("Error codes on app store page", () => {
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it("A blank list of apps displays correctly", () => {
        cy.intercept("/app_store/api/applications", {
            statusCode: 204,
            body: '{"count": 1, "next": "None", "previous": "None", "results": []}',
        }).as("twoHundredFour");
        cy.visit("/#/application-repository");
        cy.wait("@twoHundredFour");
        appPage.assertBlankAppList();
    });

    it("Application store page handles 400 error code gracefully", () => {
        cy.intercept("/app_store/api/applications", { statusCode: 400 }).as("fourHundred");
        cy.visit("/#/application-repository");
        cy.wait("@fourHundred");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving applications!",
        );
    });

    it("Application store page handles 403 error code gracefully", () => {
        cy.intercept("/app_store/api/applications", { statusCode: 403 }).as("fourHundredThree");
        cy.visit("/#/application-repository");
        cy.wait("@fourHundredThree");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving applications!",
        );
    });

    it("Application store page handles 500 error code gracefully", () => {
        cy.intercept("/app_store/api/applications", { statusCode: 500 }).as("fiveHundred");
        cy.visit("/#/application-repository");
        cy.wait("@fiveHundred");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving applications!",
        );
    });
});
